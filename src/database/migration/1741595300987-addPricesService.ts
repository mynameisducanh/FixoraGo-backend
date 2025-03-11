import {MigrationInterface, QueryRunner} from "typeorm";

export class addPricesService1741595300987 implements MigrationInterface {
    name = 'addPricesService1741595300987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pricesService\` (\`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`id\` varchar(36) NOT NULL, \`ServiceId\` int NOT NULL, \`UnitService\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`price\` varchar(255) NULL, \`min_price\` varchar(255) NULL, \`max_price\` varchar(255) NULL, \`ImageUrl\` varchar(255) NULL, \`TotalUse\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`pricesService\``);
    }
}
