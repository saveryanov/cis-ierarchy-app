import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1567950830720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "surname" character varying(100) NOT NULL, "avatarUrl" character varying(100), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "isRoot" boolean NOT NULL, "name" character varying(100) NOT NULL, "headRoleName" character varying(100) NOT NULL, "parentId" integer, "userId" integer, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_c50480cad914f9afa0c5213c76c" FOREIGN KEY ("parentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_1809e8e6311c8b2c88c5c2ef733" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_1809e8e6311c8b2c88c5c2ef733"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_c50480cad914f9afa0c5213c76c"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
