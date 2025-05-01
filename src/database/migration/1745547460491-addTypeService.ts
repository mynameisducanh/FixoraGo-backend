import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTypeService1745547460491 implements MigrationInterface {
  name = 'addTypeService1745547460491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`typeService\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`ServiceId\` int NOT NULL, \`UnitService\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`time\` varchar(255) NULL, \`ImageUrl\` varchar(255) NULL, \`temp\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`typeService\``);
  }
}
