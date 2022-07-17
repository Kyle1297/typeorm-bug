import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndAddresses1658005409668
  implements MigrationInterface
{
  name = 'CreateUsersAndAddresses1658005409668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL, "organisationName" character varying NOT NULL DEFAULT '', "line1" character varying NOT NULL, "line2" character varying NOT NULL DEFAULT '', "locality" character varying NOT NULL, "administrativeArea" character varying NOT NULL, "postalCode" character varying NOT NULL, "countryCode" character varying NOT NULL, "instructions" character varying NOT NULL, "additionalNotes" character varying NOT NULL DEFAULT '', "type" character varying NOT NULL, "entityId" uuid NOT NULL, "entityType" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL, "email" character varying NOT NULL, "password" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneCountryCode" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_provider" ("id" uuid NOT NULL, "provider" character varying NOT NULL, "socialId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "UQ_11c163e15c0f61964953efc47eb" UNIQUE ("socialId"), CONSTRAINT "PK_27f0b9006e0c7a2779e77a68298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_provider" ADD CONSTRAINT "FK_42804e18502e6709aba2f68f5f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_provider" DROP CONSTRAINT "FK_42804e18502e6709aba2f68f5f8"`,
    );
    await queryRunner.query(`DROP TABLE "social_provider"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
