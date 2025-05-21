import {MigrationInterface, QueryRunner} from "typeorm";

export class addLatitudeAndLongitudeUserTable1747794543566 implements MigrationInterface {
    name = 'addLatitudeAndLongitudeUserTable1747794543566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "Latitude" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "Longitude" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "Longitude"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "Latitude"`);
    }

}
