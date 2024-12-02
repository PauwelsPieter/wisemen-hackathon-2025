import { MigrationInterface, QueryRunner } from 'typeorm'

export class Contact1730209886307 implements MigrationInterface {
  name = 'Contact1730209886307'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "contact" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "firstName" character varying, "lastName" character varying, "email" character varying, "phone" character varying, CONSTRAINT "PK_126b452db77c24d32b5885f4468" PRIMARY KEY ("uuid"))`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact"`)
  }
}
