import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1658355351810 implements MigrationInterface {
  name = 'CreateOrders1658355351810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_b1b332c0f436897f21a960f26c7"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_image" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "UQ_d90afd9582d8a71650dad447ca2" UNIQUE ("key"), CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d90afd9582d8a71650dad447ca" ON "product_image" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_image" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "key" character varying NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "UQ_3849bcb15ee18b527a8cb9be639" UNIQUE ("key"), CONSTRAINT "PK_bbba846ba344b06785d41a727a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3849bcb15ee18b527a8cb9be63" ON "order_image" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderNumber" character varying NOT NULL, "currencyCode" character varying NOT NULL, "pickupBetween" character varying, "deliverBetween" character varying, "status" character varying NOT NULL, "confirmedAt" TIMESTAMP, "washerAssignedAt" TIMESTAMP, "pickedUpAt" TIMESTAMP, "readyForDeliveryAt" TIMESTAMP, "onTheWayAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "notesOnPickup" text NOT NULL DEFAULT '', "notesOnDelivery" text NOT NULL DEFAULT '', "pickupAddressId" uuid, "deliveryAddressId" uuid, "productId" uuid NOT NULL, "userId" uuid NOT NULL, "washerId" uuid, CONSTRAINT "REL_e4ea4e7f610af08341c151e38d" UNIQUE ("pickupAddressId"), CONSTRAINT "REL_08fcc4e8c5af1570909f08f502" UNIQUE ("deliveryAddressId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_b1b332c0f436897f21a960f26c7" FOREIGN KEY ("imageId") REFERENCES "product_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_image" ADD CONSTRAINT "FK_ad6719dd7b5b1d016442e2cd001" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5" FOREIGN KEY ("pickupAddressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029" FOREIGN KEY ("deliveryAddressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_a40e14485d6f84ead06a1cc571e" FOREIGN KEY ("washerId") REFERENCES "washer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_a40e14485d6f84ead06a1cc571e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_image" DROP CONSTRAINT "FK_ad6719dd7b5b1d016442e2cd001"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_b1b332c0f436897f21a960f26c7"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3849bcb15ee18b527a8cb9be63"`,
    );
    await queryRunner.query(`DROP TABLE "order_image"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d90afd9582d8a71650dad447ca"`,
    );
    await queryRunner.query(`DROP TABLE "product_image"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_b1b332c0f436897f21a960f26c7" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
