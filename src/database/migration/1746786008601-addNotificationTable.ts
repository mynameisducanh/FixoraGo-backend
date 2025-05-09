import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNotificationTable1746786008601 implements MigrationInterface {
  name = 'addNotificationTable1746786008601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL DEFAULT 'SYSTEM', "priority" character varying NOT NULL DEFAULT 'MEDIUM', "status" character varying NOT NULL DEFAULT 'UNREAD', "title" character varying, "content" text, "imageUrl" character varying, "actionUrl" character varying, "metadata" character varying, "userId" character varying NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP, "expiresAt" TIMESTAMP, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
