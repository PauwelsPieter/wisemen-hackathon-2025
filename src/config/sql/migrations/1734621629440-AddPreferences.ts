import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPreferences1734621629440 implements MigrationInterface {
  name = 'AddPreferences1734621629440'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."preferences_theme_enum" AS ENUM('light', 'dark', 'system')`)
    await queryRunner.query(`CREATE TABLE "preferences" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "user_uuid" uuid NOT NULL, "theme" "public"."preferences_theme_enum" NOT NULL DEFAULT 'system', "language" character varying, "font_size" character varying, "show_shortcuts" boolean NOT NULL DEFAULT false, "reduce_motion" boolean NOT NULL DEFAULT false, "high_contrast" boolean NOT NULL DEFAULT false, "userUuid" uuid, CONSTRAINT "REL_eb5c111b41ffa469bbb94678e5" UNIQUE ("userUuid"), CONSTRAINT "PK_5f84a777d584af9e23340485f67" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_eb5c111b41ffa469bbb94678e56" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_eb5c111b41ffa469bbb94678e56"`)
    await queryRunner.query(`DROP TABLE "preferences"`)
    await queryRunner.query(`DROP TYPE "public"."preferences_theme_enum"`)
  }
}
