import { MigrationInterface, QueryRunner } from 'typeorm';

export class addListDetailServiceTable1746586835247
  implements MigrationInterface
{
  name = 'addListDetailServiceTable1746586835247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listDetailService" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" SERIAL NOT NULL, "serviceId" character varying NOT NULL, "name" character varying(255), "unit" character varying, "type" character varying, CONSTRAINT "PK_18eb464cf9b30062ba78ce0a1d3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listDetailService"`);
  }
}
