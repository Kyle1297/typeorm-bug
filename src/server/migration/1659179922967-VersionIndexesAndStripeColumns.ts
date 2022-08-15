import { MigrationInterface, QueryRunner } from 'typeorm';

export class VersionIndexesAndStripeColumns1659179922967
  implements MigrationInterface
{
  name = 'VersionIndexesAndStripeColumns1659179922967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_image" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "stripePaymentIntentId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "stripeCustomerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9126ad4c7a4381a75d153b5429" ON "product_feature_option_version" ("versionNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb75a417cd943138310a1a9526" ON "product_version" ("versionNumber") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb75a417cd943138310a1a9526"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9126ad4c7a4381a75d153b5429"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "stripePaymentIntentId"`,
    );
    await queryRunner.query(`ALTER TABLE "order_image" DROP COLUMN "type"`);
  }
}
