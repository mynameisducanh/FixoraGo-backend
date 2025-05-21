import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSkillFixerTable1747793248111 implements MigrationInterface {
  name = 'addSkillFixerTable1747793248111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skillFixer" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "Name" character varying, "type" character varying, "temp" character varying, CONSTRAINT "PK_9307035eae6583677e266e9e2d1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "skillFixer"`);
  }
}
