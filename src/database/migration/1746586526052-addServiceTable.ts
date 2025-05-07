import { MigrationInterface, QueryRunner } from 'typeorm';

export class addServiceTable1746586526052 implements MigrationInterface {
  name = 'addServiceTable1746586526052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "services" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid, "Name" character varying, "description" text, "duration" integer, "total_usage" integer DEFAULT '0', "total_views" integer DEFAULT '0', "rating" double precision DEFAULT '0', "total_reviews" integer DEFAULT '0', "image_url" character varying, "is_active" boolean DEFAULT true, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "services"`);
  }
}
