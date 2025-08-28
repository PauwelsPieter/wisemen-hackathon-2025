import { Injectable } from '@nestjs/common'
import type { SearchParams } from 'typesense/lib/Typesense/Documents.js'
import { PaginatedOffsetResponse } from '@wisemen/pagination'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Any, Repository } from 'typeorm'
import { TypesenseQueryService } from '../../../../modules/typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../../../modules/typesense/param-builders/search-params.builder.js'
import { TypesenseCollectionName } from '../../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseUser } from '../../typesense/typesense-user.js'
import { UserTypesenseCollection } from '../../typesense/user.collections.js'
import { UserUuid } from '../../entities/user.uuid.js'
import { Role } from '../../../roles/entities/role.entity.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import type { ViewUserIndexQuery } from './view-user-index.query.js'

@Injectable()
export class ViewUserIndexRepsitory {
  constructor (
    private readonly typesenseService: TypesenseQueryService,
    @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>
  ) {}

  async searchUsers (query: ViewUserIndexQuery): Promise<PaginatedOffsetResponse<TypesenseUser>> {
    const typesenseSearchParams = this.createTypesenseSearchParams(query)

    return await this.typesenseService.search(
      TypesenseCollectionName.USER,
      typesenseSearchParams
    )
  }

  async fetchUserRoles (userUuids: UserUuid[]): Promise<Map<UserUuid, Role[]>> {
    if (userUuids.length === 0) {
      return new Map()
    }

    const userRoles = await this.userRoleRepo.find({
      where: { userUuid: Any(userUuids) },
      relations: { role: true }
    })

    const result = new Map<UserUuid, Role[]>()
    for (const userRole of userRoles) {
      const roles = result.get(userRole.userUuid) ?? []
      roles.push(userRole.role!)
      result.set(userRole.userUuid, roles)
    }

    return result
  }

  private createTypesenseSearchParams (query: ViewUserIndexQuery): SearchParams<object> {
    return new TypesenseSearchParamsBuilder<UserTypesenseCollection>()
      .withQuery(query.search)
      .withOffset(query.pagination?.offset)
      .withLimit(query.pagination?.limit)
      .addSearchOn(['firstName', 'lastName', 'email'])
      .build()
  }
}
