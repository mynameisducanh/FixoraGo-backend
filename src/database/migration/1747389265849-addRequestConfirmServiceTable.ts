import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestConfirmServiceTable1747389265849
  implements MigrationInterface
{
  name = 'addRequestConfirmServiceTable1747389265849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "requestConfirmServices" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requestServiceId" character varying, "name" character varying, "userId" character varying, "type" character varying, "price" character varying, "userAccept" character varying, "status" character varying, "image" character varying, "note" text, "temp" character varying, CONSTRAINT "PK_bcee7c8a343c35789b39ca99c13" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "requestConfirmServices"`);
  }
}
