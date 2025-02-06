import { MigrationInterface, QueryRunner } from 'typeorm'
import { Roles, rolePermissions } from '../../modules/roles/defaults.roles.js'

export class RolePermissions1738686978864 implements MigrationInterface {
  name = 'RolePermissions1738686978864'

  public async up (queryRunner: QueryRunner): Promise<void> {
    for (const roleName of Object.values(Roles)) {
      const permissions = rolePermissions[roleName]

      await queryRunner.query(
        `INSERT INTO "role" ("name", "permissions") 
         VALUES ($1, $2)
         ON CONFLICT ("name") 
         DO UPDATE SET "permissions" = $2`,
        [roleName, permissions]
      )
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "role" WHERE "name" IN (${Object.values(Roles).map(role => `'${role}'`).join(', ')})`
    )
  }
}
