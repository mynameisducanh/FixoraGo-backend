import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserTable1739415367653 implements MigrationInterface {
    name = 'addUserTable1739415367653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` varchar(255) NOT NULL, \`CreateAt\` bigint NULL, \`UpdateAt\` bigint NULL, \`DeleteAt\` bigint NULL, \`Username\` varchar(255) NULL, \`Password\` varchar(255) NULL, \`AuthData\` varchar(255) NULL, \`AuthService\` varchar(255) NULL, \`GoogleId\` varchar(255) NULL, \`FacebookId\` varchar(255) NULL, \`Email\` varchar(255) NULL, \`EmailVerified\` tinyint NULL, \`PhoneVerified\` tinyint NULL, \`InfoVerified\` tinyint NULL, \`PhoneNumber\` varchar(255) NULL, \`FirstName\` varchar(255) NULL, \`LastName\` varchar(255) NULL, \`Roles\` text NULL, \`LastPasswordUpdate\` bigint NULL, \`LastPictureUpdate\` bigint NULL, \`Address\` text NULL, \`CurrentLocation\` text NULL, \`Status\` tinyint NOT NULL DEFAULT '0', \`LastCheckIn\` bigint NULL, \`Timezone\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`UserServiceUsage\``);
    }

}
