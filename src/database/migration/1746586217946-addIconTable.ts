import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconTable1746586217946 implements MigrationInterface {
  name = 'addIconTable1746586217946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Icons" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" SERIAL NOT NULL, "Name" character varying, "Url" character varying, "Type" character varying, CONSTRAINT "PK_54acaa74d70bd1687617cead093" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Icons"`);
  }
}
