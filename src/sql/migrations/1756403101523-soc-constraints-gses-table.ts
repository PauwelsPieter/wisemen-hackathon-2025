import { MigrationInterface, QueryRunner } from 'typeorm'

export class SocConstraintsGsesTable1756403101523 implements MigrationInterface {
  name = 'SocConstraintsGsesTable1756403101523'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gse" DROP COLUMN "soc"`)
    await queryRunner.query(`ALTER TABLE "gse" ADD "soc" real NOT NULL DEFAULT '0'`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gse" DROP COLUMN "soc"`)
    await queryRunner.query(`ALTER TABLE "gse" ADD "soc" smallint NOT NULL DEFAULT '0'`)
  }
}
