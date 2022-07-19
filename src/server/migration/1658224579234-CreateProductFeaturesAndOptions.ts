import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductFeaturesAndOptions1658224579234
  implements MigrationInterface
{
  name = 'CreateProductFeaturesAndOptions1658224579234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_feature_option" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "isDefault" boolean NOT NULL DEFAULT false, "productFeatureId" uuid NOT NULL, CONSTRAINT "PK_789328063b0e386e3dd80c882f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1093095f50529d6dfed93fb625" ON "product_feature_option" ("isDefault") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_feature" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text NOT NULL DEFAULT '', CONSTRAINT "PK_ce3df3f0c53e07a2e0c6e162ff7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_features_product_feature" ("productId" uuid NOT NULL, "productFeatureId" uuid NOT NULL, CONSTRAINT "PK_e8858c32cd59c31e5cba60117fd" PRIMARY KEY ("productId", "productFeatureId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83d587e2c22e98626b107c42ee" ON "product_features_product_feature" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3e16e30e52f420d11c8a29757" ON "product_features_product_feature" ("productFeatureId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "FK_3667c51c90c6c5f1d24bf55f513" FOREIGN KEY ("productFeatureId") REFERENCES "product_feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features_product_feature" ADD CONSTRAINT "FK_83d587e2c22e98626b107c42ee1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features_product_feature" ADD CONSTRAINT "FK_f3e16e30e52f420d11c8a297578" FOREIGN KEY ("productFeatureId") REFERENCES "product_feature"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_features_product_feature" DROP CONSTRAINT "FK_f3e16e30e52f420d11c8a297578"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features_product_feature" DROP CONSTRAINT "FK_83d587e2c22e98626b107c42ee1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "FK_3667c51c90c6c5f1d24bf55f513"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3e16e30e52f420d11c8a29757"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_83d587e2c22e98626b107c42ee"`,
    );
    await queryRunner.query(`DROP TABLE "product_features_product_feature"`);
    await queryRunner.query(`DROP TABLE "product_feature"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1093095f50529d6dfed93fb625"`,
    );
    await queryRunner.query(`DROP TABLE "product_feature_option"`);
  }
}
