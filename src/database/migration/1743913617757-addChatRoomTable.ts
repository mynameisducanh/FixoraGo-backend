import { MigrationInterface, QueryRunner } from 'typeorm';

export class addChatRoomTable1743913617757 implements MigrationInterface {
  name = 'addChatRoomTable1743913617757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat-room\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`staffId\` varchar(255) NOT NULL, \`status\` enum ('active', 'closed') NOT NULL DEFAULT 'active', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chat-room\``);
  }
}
