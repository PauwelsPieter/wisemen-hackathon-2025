import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1729532722607 implements MigrationInterface {
  name = 'InitialMigration1729532722607'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "file" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3), "name" character varying NOT NULL, "mimeType" character varying, "userUuid" uuid, "isUploadConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d85c96c207a7395158a68ee1265" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE TABLE "file_link" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "fileUuid" uuid NOT NULL, "entityType" character varying NOT NULL, "entityUuid" uuid NOT NULL, "entityPart" character varying NOT NULL, "order" smallint, CONSTRAINT "PK_b6d7dfcebc6f25ae6e0ac6050cc" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE INDEX "IDX_6d04074d2c5affdbb325f625ae" ON "file_link" ("fileUuid") `)
    await queryRunner.query(`CREATE INDEX "IDX_110e3d9b0c760d75304b1d966a" ON "file_link" ("entityUuid") `)
    await queryRunner.query(`CREATE INDEX "IDX_dfea84acdfe32e67cf5de7a7ec" ON "file_link" ("entityPart") `)
    await queryRunner.query(`CREATE INDEX "IDX_43c2ca34f905b6e2ac1bfc01f6" ON "file_link" ("entityType", "entityUuid") `)
    await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_6d04074d2c5affdbb325f625aef" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`)

    await queryRunner.query(`CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "permissions" character varying array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))`)

    await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3), "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "roleUuid" uuid, CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `)
    await queryRunner.query(`CREATE INDEX "IDX_8ffce172fb81226c738cef01e3" ON "user" ("roleUuid") `)
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8ffce172fb81226c738cef01e31" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8ffce172fb81226c738cef01e31"`)
    await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_6d04074d2c5affdbb325f625aef"`)
    await queryRunner.query(`DROP TABLE "role"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8ffce172fb81226c738cef01e3"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_43c2ca34f905b6e2ac1bfc01f6"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_dfea84acdfe32e67cf5de7a7ec"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_110e3d9b0c760d75304b1d966a"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_6d04074d2c5affdbb325f625ae"`)
    await queryRunner.query(`DROP TABLE "file_link"`)
    await queryRunner.query(`DROP TABLE "file"`)
  }
}
