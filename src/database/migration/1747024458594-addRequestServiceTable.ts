import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestServiceTable1747024458594 implements MigrationInterface {
  name = 'addRequestServiceTable1747024458594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "requestServices" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "fixerId" uuid, "nameService" character varying, "listDetailService" text, "priceService" character varying, "fileImage" character varying, "typeEquipment" character varying, "address" text, "calender" character varying, "note" text, "status" character varying(50), "approvedTime" character varying, "guaranteeTime" character varying, "temp" character varying, CONSTRAINT "PK_c09c487211f63bae4d1da0582b9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "requestServices"`);
  }
}
