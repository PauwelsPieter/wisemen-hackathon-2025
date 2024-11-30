import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Role } from '../entities/role.entity.js'

@Injectable()
export class RoleRepository extends TypeOrmRepository<Role> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Role, entityManager)
  }
}
