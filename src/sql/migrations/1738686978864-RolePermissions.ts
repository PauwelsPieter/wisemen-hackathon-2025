import { MigrationInterface, QueryRunner } from 'typeorm'
import { Permission } from '../../modules/permission/permission.enum.js'

export const rolePermissions: Record<string, Permission[]> = {
  admin: [Permission.ALL_PERMISSIONS],
  readonly: []
}

export class RolePermissions1738686978864 implements MigrationInterface {
  name = 'RolePermissions1738686978864'

  public async up (queryRunner: QueryRunner): Promise<void> {
    for (const [name, permissions] of Object.entries(rolePermissions)) {
      await queryRunner.query(
        `INSERT INTO "role" ("name", "permissions")
         VALUES ($1, $2)
         ON CONFLICT ("name")
         DO UPDATE SET "permissions" = $2`,
        [name, permissions]
      )
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "role" WHERE "name" IN (${Object.keys(rolePermissions).map(role => `'${role}'`).join(', ')})`
    )
  }
}
