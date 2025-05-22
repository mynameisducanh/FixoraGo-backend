import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserIdOfFixerTable1747814600631 implements MigrationInterface {
  name = 'addUserIdOfFixerTable1747814600631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Fixer" ADD "UserId" uuid NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Fixer" DROP COLUMN "UserId"`);
  }
}
