import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTokenTable1740104740454 implements MigrationInterface {
  name = 'addTokenTable1740104740454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Tokens\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`Id\` varchar(36) NOT NULL, \`RefreshToken\` varchar(4096) NOT NULL, \`refreshPublicKey\` varchar(4096) NOT NULL, \`accessPublicKey\` varchar(4096) NOT NULL, \`UserId\` varchar(255) NOT NULL, \`ExpireAt\` datetime NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`Tokens\``);
  }
}
