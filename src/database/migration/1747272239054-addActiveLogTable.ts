import { MigrationInterface, QueryRunner } from 'typeorm';

export class addActiveLogTable1747272239054 implements MigrationInterface {
  name = 'addActiveLogTable1747272239054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activityLogs" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityType" character varying NOT NULL, "fixerId" character varying, "userId" character varying, "requestServiceId" character varying, "requestConfirmId" character varying, "note" text, "imageUrl" character varying, "address" text, "latitude" character varying, "longitude" character varying, "temp" character varying, CONSTRAINT "PK_bcb62ef0db5c83642a6250f3cb7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activityLogs"`);
  }
}
