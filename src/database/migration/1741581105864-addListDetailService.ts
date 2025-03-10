import { MigrationInterface, QueryRunner } from 'typeorm';

export class addListDetailService1741581105864 implements MigrationInterface {
  name = 'addListDetailService1741581105864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`listDetailService\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`serviceId\` int NOT NULL, \`name\` varchar(255) NULL, \`unit\` varchar(255) NULL, \`type\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`listDetailService\``);
  }
}
