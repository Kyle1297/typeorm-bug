import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePrices1658175102900 implements MigrationInterface {
  name = 'CreatePrices1658175102900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "price" ("id" uuid NOT NULL, "isPerBag" boolean NOT NULL, "aud_in_cents" integer NOT NULL, "entityId" uuid NOT NULL, "entityType" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "price"`);
  }
}
