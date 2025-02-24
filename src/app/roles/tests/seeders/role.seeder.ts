import type { EntityManager } from 'typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'

export class RoleSeeder extends AbstractSeeder<Role> {
  constructor (manager: EntityManager) {
    super(new TypeOrmRepository(Role, manager))
  }
}
