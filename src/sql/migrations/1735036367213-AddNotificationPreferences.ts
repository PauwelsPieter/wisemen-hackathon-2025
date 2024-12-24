import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNotificationPreferences1735036367213 implements MigrationInterface {
  name = 'AddNotificationPreferences1735036367213'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."preferences_theme_enum" AS ENUM('light', 'dark', 'system')`)
    await queryRunner.query(`CREATE TABLE "preferences" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "user_uuid" uuid NOT NULL, "theme" "public"."preferences_theme_enum" NOT NULL DEFAULT 'system', "language" character varying, "font_size" character varying, "show_shortcuts" boolean NOT NULL DEFAULT false, "reduce_motion" boolean NOT NULL DEFAULT false, "high_contrast" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_cb58311dc6f1d7d117e74962b5d" UNIQUE ("user_uuid"), CONSTRAINT "REL_cb58311dc6f1d7d117e74962b5" UNIQUE ("user_uuid"), CONSTRAINT "PK_5f84a777d584af9e23340485f67" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_cb58311dc6f1d7d117e74962b5d" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_cb58311dc6f1d7d117e74962b5d"`)
    await queryRunner.query(`DROP TABLE "preferences"`)
    await queryRunner.query(`DROP TYPE "public"."preferences_theme_enum"`)
  }
}
