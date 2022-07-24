import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingUserToWashers1658691615034
  implements MigrationInterface
{
  name = 'AddMissingUserToWashers1658691615034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "washer" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "UQ_24fbe9c5f15562173b8587c5b3f" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" ADD CONSTRAINT "FK_24fbe9c5f15562173b8587c5b3f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "FK_24fbe9c5f15562173b8587c5b3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "washer" DROP CONSTRAINT "UQ_24fbe9c5f15562173b8587c5b3f"`,
    );
    await queryRunner.query(`ALTER TABLE "washer" DROP COLUMN "userId"`);
  }
}
