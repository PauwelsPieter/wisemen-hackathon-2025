import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { UserRole } from '../entities/user-role.entity.js'

@Injectable()
export class UserRoleRepository extends TypeOrmRepository<UserRole> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(UserRole, entityManager)
  }
}
