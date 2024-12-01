import { MigrationInterface, QueryRunner } from 'typeorm'

export class EnablePgBossWorker1732990798611 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER SCHEMA pgboss RENAME TO pgboss_v9`)

    await queryRunner.query(`SELECT pgboss.create_queue('system', '{"policy":"stately"}')`)
    await queryRunner.query(`SELECT pgboss.create_queue('nats', '{"policy":"stately"}')`)
    await queryRunner.query(`SELECT pgboss.create_queue('typesense', '{"policy":"stately"}')`)
  }

  public async down (_queryRunner: QueryRunner): Promise<void> {
  }
}
