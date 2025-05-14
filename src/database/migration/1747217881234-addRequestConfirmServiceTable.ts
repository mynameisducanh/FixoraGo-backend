import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestConfirmServiceTable1747217881234
  implements MigrationInterface
{
  name = 'addRequestConfirmServiceTable1747217881234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "requestConfirmServices" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requestConfirmId" character varying NOT NULL, "name" character varying NOT NULL, "userId" character varying NOT NULL, "type" character varying NOT NULL, "price" character varying NOT NULL, "image" character varying, "note" text, CONSTRAINT "PK_bcee7c8a343c35789b39ca99c13" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "requestConfirmServices"`);
  }
}
