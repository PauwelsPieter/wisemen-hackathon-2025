import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPlanningEntity1756452100127 implements MigrationInterface {
  name = 'AddPlanningEntity1756452100127'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "planning" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "gse_uuid" uuid NOT NULL, "from" TIMESTAMP WITH TIME ZONE NOT NULL, "to" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_69ab6c9a9534865e1626c1b6db3" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`ALTER TABLE "planning" ADD CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf" FOREIGN KEY ("gse_uuid") REFERENCES "airport"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "planning" DROP CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf"`)
    await queryRunner.query(`DROP TABLE "planning"`)
  }
}
