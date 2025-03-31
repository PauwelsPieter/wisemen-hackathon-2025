import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeEventLogsAHypertable1741898201347 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb`)
    await queryRunner.query(`SELECT create_hypertable('event_log', 'created_at', chunk_time_interval => INTERVAL '1 day')`)
  }

  public async down (): Promise<void> {}
}
