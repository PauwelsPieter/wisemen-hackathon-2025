import type { EntityManager } from 'typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'
import { UserRole } from '../../entities/user-role.entity.js'

export class UserRoleSeeder extends AbstractSeeder<UserRole> {
  constructor (
    manager: EntityManager
  ) {
    super(new TypeOrmRepository(UserRole, manager))
  }

  async seedUserRoles (userRoles: UserRole[]): Promise<void> {
    await this.repository.insert(userRoles)
  }
}
