import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserTable1746585018831 implements MigrationInterface {
  name = 'addUserTable1746585018831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL, "CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "Username" character varying, "Password" character varying, "AuthData" character varying, "AuthService" character varying, "GoogleId" character varying, "FacebookId" character varying, "Email" character varying, "EmailVerified" smallint, "PhoneVerified" smallint, "InfoVerified" smallint, "PhoneNumber" character varying, "FirstName" character varying, "LastName" character varying, "Roles" text, "LastPasswordUpdate" bigint, "LastPictureUpdate" bigint, "Address" text, "CurrentLocation" text, "Status" smallint NOT NULL DEFAULT '0', "LastCheckIn" bigint, "Timezone" jsonb, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Users"`);
  }
}
