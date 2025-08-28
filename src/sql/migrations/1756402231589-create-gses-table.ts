import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateGsesTable1756402231589 implements MigrationInterface {
  name = 'CreateGsesTable1756402231589'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."gse_type_enum" AS ENUM('belt_loader', 'gpu', 'pushback_tractor', 'stairs')`)
    await queryRunner.query(`CREATE TABLE "gse" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "airport_uuid" uuid, "type" "public"."gse_type_enum" NOT NULL, "soc" smallint NOT NULL DEFAULT '0', "temperature_celsius" real NOT NULL DEFAULT '0', "location" geometry(Point,4326) NOT NULL, CONSTRAINT "PK_9214bedc1f9cb558dcc1a5b5469" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE INDEX "IDX_bf4c69f1f2ec50adef737247e8" ON "gse" USING GiST ("location") `)
    await queryRunner.query(`ALTER TABLE "gse" ADD CONSTRAINT "FK_61b9e8461c6b361578eb2183283" FOREIGN KEY ("airport_uuid") REFERENCES "airport"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gse" DROP CONSTRAINT "FK_61b9e8461c6b361578eb2183283"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_bf4c69f1f2ec50adef737247e8"`)
    await queryRunner.query(`DROP TABLE "gse"`)
    await queryRunner.query(`DROP TYPE "public"."gse_type_enum"`)
  }
}
