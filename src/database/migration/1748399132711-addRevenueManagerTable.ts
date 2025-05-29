import {MigrationInterface, QueryRunner} from "typeorm";

export class addRevenueManagerTable1748399132711 implements MigrationInterface {
    name = 'addRevenueManagerTable1748399132711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "RevenueManager" ("CreateAt" bigint, "UpdateAt" bigint, "DeleteAt" bigint, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "expires" bigint, "totalRevenue" numeric(15,2) NOT NULL DEFAULT '0', "paidFees" numeric(15,2) NOT NULL DEFAULT '0', "unpaidFees" numeric(15,2) NOT NULL DEFAULT '0', "note" text, "status" character varying NOT NULL DEFAULT 'active', "temp" character varying, CONSTRAINT "PK_9e8873345eb7afd8f4fafb25c62" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "RevenueManager"`);
    }

}
