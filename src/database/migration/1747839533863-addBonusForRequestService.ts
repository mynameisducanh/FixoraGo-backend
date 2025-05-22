import {MigrationInterface, QueryRunner} from "typeorm";

export class addBonusForRequestService1747839533863 implements MigrationInterface {
    name = 'addBonusForRequestService1747839533863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requestServices" ADD "isUrgent" character varying`);
        await queryRunner.query(`ALTER TABLE "requestServices" ADD "bonus" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requestServices" DROP COLUMN "bonus"`);
        await queryRunner.query(`ALTER TABLE "requestServices" DROP COLUMN "isUrgent"`);
    }

}
