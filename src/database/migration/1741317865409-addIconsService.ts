import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconsService1741317865409 implements MigrationInterface {
  name = 'addIconsService1741317865409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`iconsService\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`Name\` varchar(255) NULL, \`Url\` varchar(255) NULL, \`Type\` varchar(255) NULL, \`idService\` int NOT NULL, \`total_views\` int NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`iconsService\``);
  }
}
