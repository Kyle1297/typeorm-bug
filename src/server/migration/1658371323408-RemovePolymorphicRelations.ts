import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePolymorphicRelations1658371323408
  implements MigrationInterface
{
  name = 'RemovePolymorphicRelations1658371323408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "FK_f0c1d400336e46ae997e119b52d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029"`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_address" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL DEFAULT '', "locality" character varying NOT NULL, "administrativeArea" character varying NOT NULL, "postalCode" character varying NOT NULL, "countryCode" character varying NOT NULL, CONSTRAINT "PK_f9ab361830e02bf9e7a56e88e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_feature_option_price" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isPerBag" boolean NOT NULL DEFAULT true, "audInCents" integer NOT NULL, CONSTRAINT "PK_499f815a0794c3ef074b223e9f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_price" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isPerBag" boolean NOT NULL DEFAULT true, "audInCents" integer NOT NULL, CONSTRAINT "PK_039c4320ccd5ede07440f499268" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "washer_address" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL DEFAULT '', "locality" character varying NOT NULL, "administrativeArea" character varying NOT NULL, "postalCode" character varying NOT NULL, "countryCode" character varying NOT NULL, "organisationName" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a8c4f4f0936e135045be27e4dd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_address" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL DEFAULT '', "locality" character varying NOT NULL, "administrativeArea" character varying NOT NULL, "postalCode" character varying NOT NULL, "countryCode" character varying NOT NULL, "organisationName" character varying NOT NULL DEFAULT '', "instructions" character varying NOT NULL, "additionalNotes" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_f07603e96b068aae820d4590270" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_address" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL DEFAULT '', "locality" character varying NOT NULL, "administrativeArea" character varying NOT NULL, "postalCode" character varying NOT NULL, "countryCode" character varying NOT NULL, "organisationName" character varying NOT NULL DEFAULT '', "instructions" character varying NOT NULL, "additionalNotes" character varying NOT NULL DEFAULT '', "type" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a15c0cb8a601ceed5ca6628db" ON "user_address" ("type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c" FOREIGN KEY ("addressId") REFERENCES "business_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a" FOREIGN KEY ("priceId") REFERENCES "product_feature_option_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_40e084538467ad26eda659598ac" FOREIGN KEY ("priceId") REFERENCES "product_price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "FK_f0c1d400336e46ae997e119b52d" FOREIGN KEY ("addressId") REFERENCES "washer_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5" FOREIGN KEY ("pickupAddressId") REFERENCES "order_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029" FOREIGN KEY ("deliveryAddressId") REFERENCES "order_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "FK_f0c1d400336e46ae997e119b52d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a15c0cb8a601ceed5ca6628db"`,
    );
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TABLE "order_address"`);
    await queryRunner.query(`DROP TABLE "washer_address"`);
    await queryRunner.query(`DROP TABLE "product_price"`);
    await queryRunner.query(`DROP TABLE "product_feature_option_price"`);
    await queryRunner.query(`DROP TABLE "business_address"`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_08fcc4e8c5af1570909f08f5029" FOREIGN KEY ("deliveryAddressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e4ea4e7f610af08341c151e38d5" FOREIGN KEY ("pickupAddressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "FK_f0c1d400336e46ae997e119b52d" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_40e084538467ad26eda659598ac" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
