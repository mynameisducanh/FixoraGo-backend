import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestConfirmTable1747126882543 implements MigrationInterface {
  name = 'addRequestConfirmTable1747126882543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "requestConfirms" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "staffId" uuid, "requestServiceId" uuid, "proposedPrice" character varying, "negotiatedPrice" character varying, "StaffVerified" character varying, "UserVerified" character varying, "userNote" text, "staffNote" text, "status" character varying(50) NOT NULL DEFAULT 'pending', "temp" character varying, CONSTRAINT "PK_960e22448e3f177efdb8c19189d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "requestConfirms"`);
  }
}
