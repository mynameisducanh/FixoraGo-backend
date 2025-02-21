import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableOtp1740036581950 implements MigrationInterface {
    name = 'addTableOtp1740036581950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Otps\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`expires\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`Otps\``);
    }

}
