import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsAndImages1658180142429
  implements MigrationInterface
{
  name = 'CreateProductsAndImages1658180142429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL, "name" character varying NOT NULL, "key" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c77ec1a4c00eda85540cbe57ae" UNIQUE ("key"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7c77ec1a4c00eda85540cbe57a" ON "image" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f54e3a35bede3a3739efe3ed8" ON "address" ("type") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7373a4a9309c131d50e3d3e264" ON "social_provider" ("provider") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_11c163e15c0f61964953efc47e" ON "social_provider" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21e354f94d15e9c7eadb16267c" ON "washer" ("status") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_21e354f94d15e9c7eadb16267c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11c163e15c0f61964953efc47e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7373a4a9309c131d50e3d3e264"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f54e3a35bede3a3739efe3ed8"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c77ec1a4c00eda85540cbe57a"`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
