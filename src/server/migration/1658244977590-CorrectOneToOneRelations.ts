import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectOneToOneRelations1658244977590
  implements MigrationInterface
{
  name = 'CorrectOneToOneRelations1658244977590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD "priceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "UQ_6ba72b94c01f9a4dd570391698a" UNIQUE ("priceId")`,
    );
    await queryRunner.query(`ALTER TABLE "business" ADD "addressId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "UQ_174ed7ed15b91521a777b0ef49c" UNIQUE ("addressId")`,
    );
    await queryRunner.query(`ALTER TABLE "washer" ADD "addressId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "UQ_f0c1d400336e46ae997e119b52d" UNIQUE ("addressId")`,
    );
    await queryRunner.query(`ALTER TABLE "washer" ADD "businessId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "UQ_89fb3a16188c292d613d41b24f7" UNIQUE ("businessId")`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "imageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_b1b332c0f436897f21a960f26c7" UNIQUE ("imageId")`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "priceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_40e084538467ad26eda659598ac" UNIQUE ("priceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" ADD CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "FK_f0c1d400336e46ae997e119b52d" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "FK_89fb3a16188c292d613d41b24f7" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_b1b332c0f436897f21a960f26c7" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_40e084538467ad26eda659598ac" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_b1b332c0f436897f21a960f26c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "FK_89fb3a16188c292d613d41b24f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "FK_f0c1d400336e46ae997e119b52d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "FK_174ed7ed15b91521a777b0ef49c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "FK_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "priceId"`);
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_b1b332c0f436897f21a960f26c7"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "imageId"`);
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "UQ_89fb3a16188c292d613d41b24f7"`,
    );
    await queryRunner.query(`ALTER TABLE "washer" DROP COLUMN "businessId"`);
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "UQ_f0c1d400336e46ae997e119b52d"`,
    );
    await queryRunner.query(`ALTER TABLE "washer" DROP COLUMN "addressId"`);
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "UQ_174ed7ed15b91521a777b0ef49c"`,
    );
    await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "addressId"`);
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP CONSTRAINT "UQ_6ba72b94c01f9a4dd570391698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_feature_option" DROP COLUMN "priceId"`,
    );
  }
}
