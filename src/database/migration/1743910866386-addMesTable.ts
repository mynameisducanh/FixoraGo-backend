import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMesTable1743910866386 implements MigrationInterface {
  name = 'addMesTable1743910866386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat-message\` (\`id\` varchar(36) NOT NULL, \`roomId\` varchar(255) NOT NULL, \`senderId\` varchar(255) NOT NULL, \`senderName\` varchar(255) NOT NULL, \`receiverId\` varchar(255) NOT NULL, \`receiverName\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chat-message\``);
  }
}
