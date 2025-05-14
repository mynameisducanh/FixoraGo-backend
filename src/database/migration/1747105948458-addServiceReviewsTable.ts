import { MigrationInterface, QueryRunner } from 'typeorm';

export class addServiceReviewsTable1747105948458 implements MigrationInterface {
  name = 'addServiceReviewsTable1747105948458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "serviceReviews" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idRequestService" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, "type" text, "userId" uuid NOT NULL, "fixerId" character varying, "temp" character varying, CONSTRAINT "PK_bc6482ddb03b4d0d40f746e136f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "serviceReviews"`);
  }
}
