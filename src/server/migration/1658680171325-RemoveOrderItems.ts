import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOrderItems1658680171325 implements MigrationInterface {
  name = 'RemoveOrderItems1658680171325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_version" DROP CONSTRAINT "FK_05942f2077eaf3b14a4a6981e2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" RENAME COLUMN "deliveryCostId" TO "expressDeliveryPriceId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_preferences_product_feature_option_version" ("orderId" uuid NOT NULL, "productFeatureOptionVersionId" uuid NOT NULL, CONSTRAINT "PK_3e8e44ba62a1768958c565fa87e" PRIMARY KEY ("orderId", "productFeatureOptionVersionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f4870c1d2c383e147887078df" ON "order_preferences_product_feature_option_version" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0298c356e33d265749d8cef328" ON "order_preferences_product_feature_option_version" ("productFeatureOptionVersionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "isExpressDelivery" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "totalPriceInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "pickupDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "deliveryDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "pickupBetween" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "deliverBetween" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" ADD CONSTRAINT "FK_c197e4684a48bbf64bd5cc78950" FOREIGN KEY ("expressDeliveryPriceId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_preferences_product_feature_option_version" ADD CONSTRAINT "FK_1f4870c1d2c383e147887078dfc" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_preferences_product_feature_option_version" ADD CONSTRAINT "FK_0298c356e33d265749d8cef3286" FOREIGN KEY ("productFeatureOptionVersionId") REFERENCES "product_feature_option_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_preferences_product_feature_option_version" DROP CONSTRAINT "FK_0298c356e33d265749d8cef3286"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_preferences_product_feature_option_version" DROP CONSTRAINT "FK_1f4870c1d2c383e147887078dfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" DROP CONSTRAINT "FK_c197e4684a48bbf64bd5cc78950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "deliverBetween" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "pickupBetween" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryDate"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "pickupDate"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "totalPriceInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "isExpressDelivery"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "quantity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0298c356e33d265749d8cef328"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f4870c1d2c383e147887078df"`,
    );
    await queryRunner.query(
      `DROP TABLE "order_preferences_product_feature_option_version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" RENAME COLUMN "expressDeliveryPriceId" TO "deliveryCostId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" ADD CONSTRAINT "FK_05942f2077eaf3b14a4a6981e2d" FOREIGN KEY ("deliveryCostId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
