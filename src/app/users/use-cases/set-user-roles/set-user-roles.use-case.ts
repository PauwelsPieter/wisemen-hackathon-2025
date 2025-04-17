import assert from 'assert'
import { Injectable } from '@nestjs/common'
import { Any, DataSource, Repository } from 'typeorm'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { TypesenseCollectionName } from '../../../../modules/typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../../../modules/typesense/services/typesense-collection.service.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { User } from '../../entities/user.entity.js'
import { UserCache } from '../../cache/user-cache.service.js'
import { UserUuid } from '../../entities/user.uuid.js'
import type { SetUserRolesCommand } from './set-user-roles.command.js'

@Injectable()
export class SetUserRolesUseCase {
  constructor (
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly userCache: UserCache,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async changeRoles (userUuid: UserUuid, dto: SetUserRolesCommand): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      relations: { userRoles: { role: true } }
    })

    assert(user.userRoles != null)

    const existingRoleUuids = user.userRoles.map(userRole => userRole.roleUuid)

    const rolesToAdd = dto.roleUuids.filter(roleUuid => !existingRoleUuids.includes(roleUuid))
      .map(roleUuid => this.userRoleRepository.create({
        userUuid,
        roleUuid
      }))

    const rolesToRemove = existingRoleUuids.filter(roleUuid => !dto.roleUuids.includes(roleUuid))

    await transaction(this.dataSource, async () => {
      await this.userRoleRepository.insert(rolesToAdd)

      await this.userRoleRepository.delete({
        userUuid,
        roleUuid: Any(rolesToRemove)
      })
    })

    await this.userCache.setUserRoles(userUuid, dto.roleUuids)
    await this.typesenseService.importManually(TypesenseCollectionName.USER, [user])
  }
}
