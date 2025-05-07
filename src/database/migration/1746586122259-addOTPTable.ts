import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOTPTable1746586122259 implements MigrationInterface {
  name = 'addOTPTable1746586122259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "otps" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "otp" character varying(255) NOT NULL, "expires" bigint NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otps"`);
  }
}
