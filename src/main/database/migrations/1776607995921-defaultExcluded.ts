import { MigrationInterface, QueryRunner } from 'typeorm'

export class ExcludeByDefault1776607995921 implements MigrationInterface {
  name = 'ExcludeByDefault1776607995921'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tag ADD excludeByDefault BOOLEAN DEFAULT (false)')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tag', 'excludeByDefault')
  }
}

