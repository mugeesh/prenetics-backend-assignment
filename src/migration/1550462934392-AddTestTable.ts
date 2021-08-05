import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTestTable1550462934392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "test"."test" ("testid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "value" text NOT NULL DEFAULT 'none', "comment" text, "user" text NOT NULL, PRIMARY KEY("testid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "test"`);
    }

}
