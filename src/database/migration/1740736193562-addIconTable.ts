import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconTable1740736193562 implements MigrationInterface {
  name = 'addIconTable1740736193562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Icons\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`Name\` varchar(255) NULL, \`Url\` varchar(255) NULL, \`Type\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`Icons\``);
  }
}
