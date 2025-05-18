import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserTable1747537928616 implements MigrationInterface {
  name = 'addUserTable1747537928616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "AvatarUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "Gioitinh" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "Gioitinh"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "AvatarUrl"`);
  }
}
