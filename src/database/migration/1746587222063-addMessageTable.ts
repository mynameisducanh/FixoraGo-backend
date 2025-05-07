import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMessageTable1746587222063 implements MigrationInterface {
  name = 'addMessageTable1746587222063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat-message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomId" character varying NOT NULL, "senderId" character varying NOT NULL, "senderName" character varying NOT NULL, "receiverId" character varying NOT NULL, "receiverName" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91af25ec108ccf0fb98559bc8bf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "chat-message"`);
  }
}
