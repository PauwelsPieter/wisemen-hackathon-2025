import { MigrationInterface, QueryRunner } from 'typeorm'
import PgBoss from 'pg-boss'

export class PgBossMigration1733385371620 implements MigrationInterface {
  name = 'PgBossMigration1733385371620'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1
            FROM information_schema.schemata
            WHERE schema_name = 'pgboss'
          ) THEN
            EXECUTE 'ALTER SCHEMA pgboss RENAME TO pgboss_v9';
          END IF;
        END $$;
      `)

    const migrations = PgBoss.getConstructionPlans()

    await queryRunner.query(migrations)

    await queryRunner.query(`SELECT pgboss.create_queue('system', '{"policy":"stately"}')`)
    await queryRunner.query(`SELECT pgboss.create_queue('nats', '{"policy":"stately"}')`)
    await queryRunner.query(`SELECT pgboss.create_queue('typesense', '{"policy":"stately"}')`)
  }

  public async down (_queryRunner: QueryRunner): Promise<void> {

  }
}
