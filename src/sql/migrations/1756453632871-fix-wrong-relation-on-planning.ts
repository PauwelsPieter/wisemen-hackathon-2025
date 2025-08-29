import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixWrongRelationOnPlanning1756453632871
implements MigrationInterface {
  name = 'FixWrongRelationOnPlanning1756453632871'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "planning" DROP CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf"`
    )
    await queryRunner.query(
      `ALTER TABLE "planning" ADD CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf" FOREIGN KEY ("gse_uuid") REFERENCES "gse"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "planning" DROP CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf"`
    )
    await queryRunner.query(
      `ALTER TABLE "planning" ADD CONSTRAINT "FK_b087cfbf0c11f1303a68620f9bf" FOREIGN KEY ("gse_uuid") REFERENCES "airport"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
