import type { EntityManager } from 'typeorm'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { UserRoleRepository } from '../../repositories/user-role.repository.js'

export class UserRoleSeeder extends AbstractSeeder<UserRole> {
  constructor (manager: EntityManager) {
    super(new UserRoleRepository(manager))
  }

  async seedUserRoles (userRoles: UserRole[]): Promise<void> {
    await this.repository.insert(userRoles)
  }
}
