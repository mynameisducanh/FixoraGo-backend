import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTypeServiceTable1746586972684 implements MigrationInterface {
  name = 'addTypeServiceTable1746586972684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "typeService" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ServiceId" character varying NOT NULL, "UnitService" character varying NOT NULL, "name" character varying(255), "time" character varying, "ImageUrl" character varying, "temp" character varying, CONSTRAINT "PK_9b405e2ae3a89b92a4fdcc753ce" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "typeService"`);
  }
}
