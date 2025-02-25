import { randomUUID } from 'crypto'
import type { EntityManager } from 'typeorm'
import type { Permission } from 'src/modules/permission/permission.enum.js'
import { UserSeeder } from '../../src/app/users/tests/user.seeder.js'
import { RoleSeeder } from '../../src/app/roles/tests/seeders/role.seeder.js'
import { Role } from '../../src/app/roles/entities/role.entity.js'
import { UserEntityBuilder } from '../../src/app/users/tests/user-entity.builder.js'
import type { TestUser } from '../../src/app/users/tests/setup-user.type.js'
import { User } from '../../src/app/users/entities/user.entity.js'
import { UserRoleSeeder } from '../../src/app/roles/tests/seeders/user-role.seeder.js'
import { RoleEntityBuilder } from '../../src/app/roles/tests/builders/entities/role-entity.builder.js'
import { UserRoleEntityBuilder } from '../../src/app/roles/tests/builders/entities/user-role-entity.builder.js'

export class TestAuthContext {
  private readonly userSeeder: UserSeeder
  private readonly roleSeeder: RoleSeeder
  private readonly userRoleSeeder: UserRoleSeeder

  private adminRole?: Role
  private defaultRole?: Role

  private users: Map<string, User> = new Map()

  constructor (
    private readonly manager: EntityManager
  ) {
    this.roleSeeder = new RoleSeeder(this.manager)
    this.userSeeder = new UserSeeder(this.manager)
    this.userRoleSeeder = new UserRoleSeeder(this.manager)
  }

  public async getAdminRole (): Promise<Role> {
    if (this.adminRole == null) {
      this.adminRole = await this.manager.findOneByOrFail(Role, {
        isSystemAdmin: true
      })
    }

    return this.adminRole
  }

  public async getDefaultRole (): Promise<Role> {
    if (this.defaultRole == null) {
      this.defaultRole = await this.manager.findOneByOrFail(Role, {
        isDefault: true
      })
    }

    return this.defaultRole
  }

  public async getRole (withPermissions: Permission[]): Promise<Role> {
    return await this.roleSeeder.seedOne(
      new RoleEntityBuilder()
        .withName(randomUUID())
        .withPermissions(withPermissions)
        .build()
    )
  }

  public async getUser (permissions: Permission[]): Promise<TestUser> {
    const role = await this.getRole(permissions)
    const user = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .build()
    )

    const userRole = await this.userRoleSeeder.seedOne(
      new UserRoleEntityBuilder()
        .withUserUuid(user.uuid)
        .withRoleUuid(role.uuid)
        .build()
    )

    const token = this.getToken(user)

    userRole.role = role
    user.userRoles = [userRole]

    return { user, token }
  }

  public async getAdminUser (): Promise<TestUser> {
    const adminRole = await this.getAdminRole()
    const adminUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .build()
    )

    const adminUserRole = await this.userRoleSeeder.seedOne(
      new UserRoleEntityBuilder()
        .withUserUuid(adminUser.uuid)
        .withRoleUuid(adminRole.uuid)
        .build()
    )

    const token = this.getToken(adminUser)

    adminUserRole.role = adminRole
    adminUser.userRoles = [adminUserRole]

    return { user: adminUser, token }
  }

  public async getDefaultUser (): Promise<TestUser> {
    const defaultRole = await this.getDefaultRole()
    const defaultUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .build()
    )

    const defaultUserRole = await this.userRoleSeeder.seedOne(
      new UserRoleEntityBuilder()
        .withUserUuid(defaultUser.uuid)
        .withRoleUuid(defaultRole.uuid)
        .build()
    )

    const token = this.getToken(defaultUser)

    defaultUserRole.role = defaultRole
    defaultUser.userRoles = [defaultUserRole]

    return { user: defaultUser, token }
  }

  public async getRandomUser (): Promise<TestUser> {
    const randomUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .build()
    )

    const token = this.getToken(randomUser)

    return { user: randomUser, token }
  }

  public resolveUser (token: string): User {
    const user = this.users.get(token)

    if (user == null) {
      throw new Error('User not found')
    }

    return user
  }

  public getToken (user: User): string {
    const token = randomUUID()

    this.users.set(token, user)

    return token
  }
}
