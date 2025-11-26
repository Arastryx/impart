import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class NsfwTags1746577567101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE tag ADD isNsfw BOOLEAN DEFAULT (false)')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('tag', 'isNsfw')
  }
}
