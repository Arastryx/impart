import { MigrationInterface, QueryRunner } from 'typeorm'

export class NsfwPrivateRename1763407600185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE tag RENAME COLUMN isNsfw TO isPrivate')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE tag RENAME COLUMN isPrivate TO isNsfw')
  }
}

