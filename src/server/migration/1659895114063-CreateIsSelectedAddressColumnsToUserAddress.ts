import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIsSelectedAddressColumnsToUserAddress1659895114063
  implements MigrationInterface
{
  name = 'CreateIsSelectedAddressColumnsToUserAddress1659895114063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD "isSelectedPickup" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD "isSelectedDelivery" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "locale" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "currencyCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "stripePaymentIntentId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_487eec2255a43853ecbe079bff" ON "user_address" ("isSelectedPickup") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_586c99e5ef854f535cdc4f5df0" ON "user_address" ("isSelectedDelivery") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_586c99e5ef854f535cdc4f5df0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_487eec2255a43853ecbe079bff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "stripePaymentIntentId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "currencyCode"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "locale"`);
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP COLUMN "isSelectedDelivery"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP COLUMN "isSelectedPickup"`,
    );
  }
}
