import assert from 'assert'
import { Injectable } from '@nestjs/common'
import { Any, DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { UserRoleRepository } from '../../../roles/repositories/user-role.repository.js'
import { CacheService } from '../../../cache/cache.service.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { TypesenseCollectionName } from '../../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../../typesense/services/typesense-collection.service.js'
import type { ChangeUserRoleCommand } from './change-user-roles.command.js'

@Injectable()
export class ChangeUserRoleUseCase {
  constructor (
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
    private readonly cache: CacheService,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async changeRoles (userUuid: string, dto: ChangeUserRoleCommand): Promise<void> {
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

    await this.cache.setUserRoles(userUuid, dto.roleUuids)
    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])
  }
}
