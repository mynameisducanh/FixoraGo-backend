import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableReviewService1745809164258 implements MigrationInterface {
  name = 'addTableReviewService1745809164258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`service_reviews\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`id_request_service\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`comment\` text NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`service_reviews\``);
  }
}
