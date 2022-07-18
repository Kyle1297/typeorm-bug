import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWashersAndBusinesses1658171753151
  implements MigrationInterface
{
  name = 'CreateWashersAndBusinesses1658171753151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "washer" ("id" uuid NOT NULL, "status" character varying NOT NULL, "lastStatusChangeAt" TIMESTAMP NOT NULL, "firstAbleToWorkAt" TIMESTAMP, "language" character varying NOT NULL DEFAULT 'en-US', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6cb2c2bc94c347cbbf1ed8c132" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "business" ("id" uuid NOT NULL, "name" character varying NOT NULL, "businessNumber" character varying NOT NULL, "isGstRegistered" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "business"`);
    await queryRunner.query(`DROP TABLE "washer"`);
  }
}
