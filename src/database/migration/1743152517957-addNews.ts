import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNews1743152517957 implements MigrationInterface {
  name = 'addNews1743152517957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`news\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`image\` varchar(255) NULL, \`description\` varchar(255) NULL, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`news\``);
  }
}
