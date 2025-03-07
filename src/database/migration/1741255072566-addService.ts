import { MigrationInterface, QueryRunner } from 'typeorm';

export class addService1741255072566 implements MigrationInterface {
  name = 'addService1741255072566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`category_id\` varchar(255) NULL, \`Name\` varchar(255) NULL, \`description\` text NULL, \`duration\` int NULL, \`total_usage\` int NULL DEFAULT '0', \`total_views\` int NULL DEFAULT '0', \`rating\` float NULL DEFAULT '0', \`total_reviews\` int NULL DEFAULT '0', \`image_url\` varchar(255) NULL, \`is_active\` tinyint NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`services\``);
  }
}
