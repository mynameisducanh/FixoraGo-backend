import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRequestServiceTable1746095016886 implements MigrationInterface {
  name = 'addRequestServiceTable1746095016886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`requestServices\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`userId\` int NULL, \`staffId\` int NULL, \`nameService\` varchar(255) NULL, \`listDetailService\` varchar(255) NULL, \`priceService\` varchar(255) NULL, \`fileImage\` varchar(255) NULL, \`typeEquipment\` varchar(255) NULL, \`address\` varchar(255) NULL, \`calender\` varchar(255) NULL, \`note\` text NULL, \`status\` varchar(50) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`requestServices\``);
  }
}
