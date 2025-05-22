import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFixerTable1747793033056 implements MigrationInterface {
  name = 'addFixerTable1747793033056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Fixer" ("id" uuid NOT NULL, "EmployeeCode" character varying NOT NULL, "Position" character varying, "CurrentLocation" character varying, "Status" character varying NOT NULL DEFAULT '0', "LastCheckIn" character varying, "Insurance" character varying, "Expiry" character varying, "Revenue" character varying, "Tax" character varying, "Timezone" jsonb, "Temp" character varying, CONSTRAINT "UQ_7254820f1168ba960bf5669febb" UNIQUE ("EmployeeCode"), CONSTRAINT "PK_9a36e4d91b48b7073e76e68c9ee" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Fixer"`);
  }
}
