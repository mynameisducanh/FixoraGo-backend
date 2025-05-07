import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconServiceTable1746586590087 implements MigrationInterface {
  name = 'addIconServiceTable1746586590087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "iconsService" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" SERIAL NOT NULL, "Name" character varying, "Url" character varying, "Type" character varying, "idService" uuid NOT NULL, "total_views" integer DEFAULT '0', CONSTRAINT "PK_bb073a737ba09a7776b5908b565" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "iconsService"`);
  }
}
