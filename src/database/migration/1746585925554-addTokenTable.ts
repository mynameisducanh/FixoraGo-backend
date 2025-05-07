import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTokenTable1746585925554 implements MigrationInterface {
  name = 'addTokenTable1746585925554';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Tokens" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "Id" uuid NOT NULL DEFAULT uuid_generate_v4(), "RefreshToken" text NOT NULL, "refreshPublicKey" text NOT NULL, "accessPublicKey" text NOT NULL, "UserId" uuid NOT NULL, "ExpireAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_6bd0a5106e7b621308bf7c75899" PRIMARY KEY ("Id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Tokens"`);
  }
}
