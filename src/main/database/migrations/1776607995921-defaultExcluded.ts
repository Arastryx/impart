import { MigrationInterface, QueryRunner } from 'typeorm'

export class DefaultExcluded1776607995921 implements MigrationInterface {
  name = 'DefaultExcluded1776607995921'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tag ADD defaultExcluded BOOLEAN DEFAULT (false)')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tag', 'defaultExcluded')
  }
}

