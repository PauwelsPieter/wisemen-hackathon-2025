import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserRolePivotTable1733306764084 implements MigrationInterface {
  name = 'AddUserRolePivotTable1733306764084'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8ffce172fb81226c738cef01e31"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8ffce172fb81226c738cef01e3"`)
    await queryRunner.query(`CREATE TABLE "user_role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userUuid" uuid NOT NULL, "roleUuid" uuid NOT NULL, CONSTRAINT "UQ_0c06865683763d1b473cd1eddb7" UNIQUE ("userUuid", "roleUuid"), CONSTRAINT "PK_8d67721f603379fc854963857b8" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE INDEX "IDX_2b2a53e07541fd26ce86e21df1" ON "user_role" ("userUuid") `)
    await queryRunner.query(`CREATE INDEX "IDX_8bc04d39dc48d0563c8142eb71" ON "user_role" ("roleUuid") `)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleUuid"`)
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_2b2a53e07541fd26ce86e21df1e" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_8bc04d39dc48d0563c8142eb715" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_8bc04d39dc48d0563c8142eb715"`)
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_2b2a53e07541fd26ce86e21df1e"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "roleUuid" uuid`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8bc04d39dc48d0563c8142eb71"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_2b2a53e07541fd26ce86e21df1"`)
    await queryRunner.query(`DROP TABLE "user_role"`)
    await queryRunner.query(`CREATE INDEX "IDX_8ffce172fb81226c738cef01e3" ON "user" ("roleUuid") `)
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8ffce172fb81226c738cef01e31" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`)
  }
}
