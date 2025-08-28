import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAirportsTable1756401129782 implements MigrationInterface {
  name = 'CreateAirportsTable1756401129782'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "airport" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying(3) NOT NULL, CONSTRAINT "UQ_9349a68ba662b31e1070f45e992" UNIQUE ("code"), CONSTRAINT "PK_76e59807e594f8c68bdf30305ed" PRIMARY KEY ("uuid"))`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "airport"`)
  }
}
