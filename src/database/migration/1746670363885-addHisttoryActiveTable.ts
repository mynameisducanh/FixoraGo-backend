import { MigrationInterface, QueryRunner } from 'typeorm';

export class addHisttoryActiveTable1746670363885 implements MigrationInterface {
  name = 'addHisttoryActiveTable1746670363885';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "historyActiveRequest" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "RequestServiceId" uuid, "Name" character varying, "RequestConfirmId" character varying, "Url" character varying, "Type" character varying, "IdService" uuid, CONSTRAINT "PK_baf54e079e3457d87f61ade15f2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "historyActiveRequest"`);
  }
}
