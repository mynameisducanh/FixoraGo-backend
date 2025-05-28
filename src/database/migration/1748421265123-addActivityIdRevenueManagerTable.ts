import { MigrationInterface, QueryRunner } from 'typeorm';

export class addActivityIdRevenueManagerTable1748421265123
  implements MigrationInterface
{
  name = 'addActivityIdRevenueManagerTable1748421265123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RevenueManager" ADD "activityId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RevenueManager" DROP COLUMN "activityId"`,
    );
  }
}
