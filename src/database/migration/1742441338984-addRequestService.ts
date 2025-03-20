import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestService1742441338984 implements MigrationInterface {
  name = 'addRequestService1742441338984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`requestServices\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`userId\` int NULL, \`staffId\` int NULL, \`nameService\` varchar(255) NULL, \`listDetailService\` varchar(255) NULL, \`priceService\` varchar(255) NULL, \`typeService\` varchar(255) NULL, \`note\` text NULL, \`status\` varchar(50) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`requestServices\``);
  }
}
