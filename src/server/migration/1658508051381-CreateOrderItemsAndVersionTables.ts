import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemsAndVersionTables1658508051381
  implements MigrationInterface
{
  name = 'CreateOrderItemsAndVersionTables1658508051381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1093095f50529d6dfed93fb625"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" RENAME COLUMN "priceId" TO "isAvailable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" RENAME CONSTRAINT "UQ_6ba72b94c01f9a4dd570391698a" TO "UQ_a0eb0aa773dd75e31b3ece7abc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "priceId" TO "isAvailable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME CONSTRAINT "UQ_40e084538467ad26eda659598ac" TO "UQ_a23b39b413d18d8c7f86b1cb2de"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_feature_option_version" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "versionNumber" integer NOT NULL, "productFeatureOptionId" uuid NOT NULL, "priceId" uuid, CONSTRAINT "PK_fa352de2b8841745d5c4833afd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_version" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "versionNumber" integer NOT NULL, "productId" uuid NOT NULL, "basePriceId" uuid NOT NULL, "deliveryCostId" uuid NOT NULL, CONSTRAINT "PK_96d83ac1322c26520791dd51343" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer NOT NULL, "totalPriceInCents" integer NOT NULL DEFAULT '0', "orderId" uuid NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" ("orderItemId" uuid NOT NULL, "productFeatureOptionVersionId" uuid NOT NULL, CONSTRAINT "PK_8264640369a6ef31cf322ca5749" PRIMARY KEY ("orderItemId", "productFeatureOptionVersionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_133b5a305ec22b11888007392c" ON "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" ("orderItemId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_379a1c072c27c92f40f4c0f781" ON "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" ("productFeatureOptionVersionId") `,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "notesOnPickup"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "notesOnDelivery"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "productId"`);
    await queryRunner.query(
      `ALTER TABLE "product_feature" ADD "isAvailable" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "washerNotesOnPickup" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "washerNotesOnDelivery" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "additionalChargesInCents" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "additionalChargeReason" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "isCancelled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "cancellationReason" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "cancelledAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "productVersionId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "UQ_a0eb0aa773dd75e31b3ece7abc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP COLUMN "isAvailable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD "isAvailable" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_a23b39b413d18d8c7f86b1cb2de"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isAvailable"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "isAvailable" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option_version" ADD CONSTRAINT "FK_12d99117f5abf416400537455d6" FOREIGN KEY ("productFeatureOptionId") REFERENCES "product_feature_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option_version" ADD CONSTRAINT "FK_bf3bf1baecaa60cd4f09cf94943" FOREIGN KEY ("priceId") REFERENCES "product_feature_option_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" ADD CONSTRAINT "FK_295ef7ef88e264423aadf4cd7f0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" ADD CONSTRAINT "FK_d1c9b41ab15cc5fbd852d09288a" FOREIGN KEY ("basePriceId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" ADD CONSTRAINT "FK_05942f2077eaf3b14a4a6981e2d" FOREIGN KEY ("deliveryCostId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_3a1e07dec44108741437302271a" FOREIGN KEY ("productVersionId") REFERENCES "product_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" ADD CONSTRAINT "FK_133b5a305ec22b11888007392c7" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" ADD CONSTRAINT "FK_379a1c072c27c92f40f4c0f781d" FOREIGN KEY ("productFeatureOptionVersionId") REFERENCES "product_feature_option_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" DROP CONSTRAINT "FK_379a1c072c27c92f40f4c0f781d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver" DROP CONSTRAINT "FK_133b5a305ec22b11888007392c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_3a1e07dec44108741437302271a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" DROP CONSTRAINT "FK_05942f2077eaf3b14a4a6981e2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" DROP CONSTRAINT "FK_d1c9b41ab15cc5fbd852d09288a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_version" DROP CONSTRAINT "FK_295ef7ef88e264423aadf4cd7f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option_version" DROP CONSTRAINT "FK_bf3bf1baecaa60cd4f09cf94943"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option_version" DROP CONSTRAINT "FK_12d99117f5abf416400537455d6"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isAvailable"`);
    await queryRunner.query(`ALTER TABLE "product" ADD "isAvailable" uuid`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_a23b39b413d18d8c7f86b1cb2de" UNIQUE ("isAvailable")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP COLUMN "isAvailable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD "isAvailable" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "UQ_a0eb0aa773dd75e31b3ece7abc5" UNIQUE ("isAvailable")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "productVersionId"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "cancelledAt"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "cancellationReason"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "isCancelled"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "additionalChargeReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "additionalChargesInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "washerNotesOnDelivery"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "washerNotesOnPickup"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature" DROP COLUMN "isAvailable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "productId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "notesOnDelivery" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "notesOnPickup" text NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_379a1c072c27c92f40f4c0f781"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_133b5a305ec22b11888007392c"`,
    );
    await queryRunner.query(
      `DROP TABLE "ord_ite_sel_pro_fea_opt_pro_fea_opt_ver"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "product_version"`);
    await queryRunner.query(`DROP TABLE "product_feature_option_version"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME CONSTRAINT "UQ_a23b39b413d18d8c7f86b1cb2de" TO "UQ_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "isAvailable" TO "priceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" RENAME CONSTRAINT "UQ_a0eb0aa773dd75e31b3ece7abc5" TO "UQ_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" RENAME COLUMN "isAvailable" TO "priceId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1093095f50529d6dfed93fb625" ON "product_feature_option" ("isDefault") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_40e084538467ad26eda659598ac" FOREIGN KEY ("priceId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a" FOREIGN KEY ("priceId") REFERENCES "product_feature_option_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
