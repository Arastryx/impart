import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitDatabase1730761117956 implements MigrationInterface {
  name = 'InitDatabase1730761117956'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tag_group" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "label" varchar,
                "groupOrder" integer NOT NULL,
                "defaultTagColor" varchar
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "tag" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "label" varchar,
                "tagOrder" integer,
                "color" varchar,
                "groupId" integer NOT NULL
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "taggable" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "parentId" integer,
                "dateModified" date NOT NULL,
                "hide" boolean NOT NULL DEFAULT (0),
                "name" varchar,
                "type" varchar NOT NULL,
                "directoryPath" varchar,
                "sourceId" integer,
                "thumbnailId" integer,
                "coverId" integer,
                "fileIndexPath" varchar,
                "fileIndexFilename" varchar,
                "dimensionsWidth" integer,
                "dimensionsHeight" integer,
                CONSTRAINT "REL_8d0c7d640b6c2ce8050b2eed9e" UNIQUE ("thumbnailId"),
                CONSTRAINT "REL_c3976209f1848ec405744090fa" UNIQUE ("coverId"),
                CONSTRAINT "UQ_cfc57fc056ece1491065fb769ef" UNIQUE ("fileIndexPath")
            )
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_c5791210d4a8ff4c680ae09619" ON "taggable" ("dateModified")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_94862f47938b19000073ff519e" ON "taggable" ("fileIndexFilename")
        `)
    await queryRunner.query(`
            CREATE TABLE "directory" (
                "path" varchar PRIMARY KEY NOT NULL,
                "recursive" boolean NOT NULL DEFAULT (0)
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "thumbnail" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "path" varchar NOT NULL,
                "dimensionsWidth" integer NOT NULL,
                "dimensionsHeight" integer NOT NULL
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "taggable_tags_tag" (
                "taggableId" integer NOT NULL,
                "tagId" integer NOT NULL,
                PRIMARY KEY ("taggableId", "tagId")
            )
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_588807f7d1c5e998731532011e" ON "taggable_tags_tag" ("taggableId")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_f902ad3ed24a9a54fc472c5d9e" ON "taggable_tags_tag" ("tagId")
        `)
    await queryRunner.query(`
            CREATE TABLE "directory_auto_tags_tag" (
                "directoryPath" varchar NOT NULL,
                "tagId" integer NOT NULL,
                PRIMARY KEY ("directoryPath", "tagId")
            )
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_74682ae37bad85f073ed99081d" ON "directory_auto_tags_tag" ("directoryPath")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_5eb55ef07f8d576539391092b2" ON "directory_auto_tags_tag" ("tagId")
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_tag" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "label" varchar,
                "tagOrder" integer,
                "color" varchar,
                "groupId" integer NOT NULL,
                CONSTRAINT "FK_9605ba62cf353ed5a95f8770765" FOREIGN KEY ("groupId") REFERENCES "tag_group" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_tag"("id", "label", "tagOrder", "color", "groupId")
            SELECT "id",
                "label",
                "tagOrder",
                "color",
                "groupId"
            FROM "tag"
        `)
    await queryRunner.query(`
            DROP TABLE "tag"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_tag"
                RENAME TO "tag"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_c5791210d4a8ff4c680ae09619"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_94862f47938b19000073ff519e"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_taggable" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "parentId" integer,
                "dateModified" date NOT NULL,
                "hide" boolean NOT NULL DEFAULT (0),
                "name" varchar,
                "type" varchar NOT NULL,
                "directoryPath" varchar,
                "sourceId" integer,
                "thumbnailId" integer,
                "coverId" integer,
                "fileIndexPath" varchar,
                "fileIndexFilename" varchar,
                "dimensionsWidth" integer,
                "dimensionsHeight" integer,
                CONSTRAINT "REL_8d0c7d640b6c2ce8050b2eed9e" UNIQUE ("thumbnailId"),
                CONSTRAINT "REL_c3976209f1848ec405744090fa" UNIQUE ("coverId"),
                CONSTRAINT "UQ_cfc57fc056ece1491065fb769ef" UNIQUE ("fileIndexPath"),
                CONSTRAINT "FK_5f34f2fe1dc8a4bf8309ecfd3c0" FOREIGN KEY ("directoryPath") REFERENCES "directory" ("path") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_e41d748837fa4b8f82877e6031a" FOREIGN KEY ("parentId") REFERENCES "taggable" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION,
                    CONSTRAINT "FK_bde4fad00f122a9eb80519a4ceb" FOREIGN KEY ("sourceId") REFERENCES "taggable" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION,
                    CONSTRAINT "FK_8d0c7d640b6c2ce8050b2eed9ee" FOREIGN KEY ("thumbnailId") REFERENCES "thumbnail" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION,
                    CONSTRAINT "FK_c3976209f1848ec405744090fae" FOREIGN KEY ("coverId") REFERENCES "taggable" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_taggable"(
                    "id",
                    "parentId",
                    "dateModified",
                    "hide",
                    "name",
                    "type",
                    "directoryPath",
                    "sourceId",
                    "thumbnailId",
                    "coverId",
                    "fileIndexPath",
                    "fileIndexFilename",
                    "dimensionsWidth",
                    "dimensionsHeight"
                )
            SELECT "id",
                "parentId",
                "dateModified",
                "hide",
                "name",
                "type",
                "directoryPath",
                "sourceId",
                "thumbnailId",
                "coverId",
                "fileIndexPath",
                "fileIndexFilename",
                "dimensionsWidth",
                "dimensionsHeight"
            FROM "taggable"
        `)
    await queryRunner.query(`
            DROP TABLE "taggable"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_taggable"
                RENAME TO "taggable"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_c5791210d4a8ff4c680ae09619" ON "taggable" ("dateModified")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_94862f47938b19000073ff519e" ON "taggable" ("fileIndexFilename")
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_588807f7d1c5e998731532011e"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_f902ad3ed24a9a54fc472c5d9e"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_taggable_tags_tag" (
                "taggableId" integer NOT NULL,
                "tagId" integer NOT NULL,
                CONSTRAINT "FK_588807f7d1c5e998731532011e4" FOREIGN KEY ("taggableId") REFERENCES "taggable" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_f902ad3ed24a9a54fc472c5d9e1" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("taggableId", "tagId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_taggable_tags_tag"("taggableId", "tagId")
            SELECT "taggableId",
                "tagId"
            FROM "taggable_tags_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "taggable_tags_tag"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_taggable_tags_tag"
                RENAME TO "taggable_tags_tag"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_588807f7d1c5e998731532011e" ON "taggable_tags_tag" ("taggableId")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_f902ad3ed24a9a54fc472c5d9e" ON "taggable_tags_tag" ("tagId")
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_74682ae37bad85f073ed99081d"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_5eb55ef07f8d576539391092b2"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_directory_auto_tags_tag" (
                "directoryPath" varchar NOT NULL,
                "tagId" integer NOT NULL,
                CONSTRAINT "FK_74682ae37bad85f073ed99081da" FOREIGN KEY ("directoryPath") REFERENCES "directory" ("path") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_5eb55ef07f8d576539391092b21" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("directoryPath", "tagId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_directory_auto_tags_tag"("directoryPath", "tagId")
            SELECT "directoryPath",
                "tagId"
            FROM "directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_directory_auto_tags_tag"
                RENAME TO "directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_74682ae37bad85f073ed99081d" ON "directory_auto_tags_tag" ("directoryPath")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_5eb55ef07f8d576539391092b2" ON "directory_auto_tags_tag" ("tagId")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "IDX_5eb55ef07f8d576539391092b2"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_74682ae37bad85f073ed99081d"
        `)
    await queryRunner.query(`
            ALTER TABLE "directory_auto_tags_tag"
                RENAME TO "temporary_directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            CREATE TABLE "directory_auto_tags_tag" (
                "directoryPath" varchar NOT NULL,
                "tagId" integer NOT NULL,
                PRIMARY KEY ("directoryPath", "tagId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "directory_auto_tags_tag"("directoryPath", "tagId")
            SELECT "directoryPath",
                "tagId"
            FROM "temporary_directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_5eb55ef07f8d576539391092b2" ON "directory_auto_tags_tag" ("tagId")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_74682ae37bad85f073ed99081d" ON "directory_auto_tags_tag" ("directoryPath")
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_f902ad3ed24a9a54fc472c5d9e"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_588807f7d1c5e998731532011e"
        `)
    await queryRunner.query(`
            ALTER TABLE "taggable_tags_tag"
                RENAME TO "temporary_taggable_tags_tag"
        `)
    await queryRunner.query(`
            CREATE TABLE "taggable_tags_tag" (
                "taggableId" integer NOT NULL,
                "tagId" integer NOT NULL,
                PRIMARY KEY ("taggableId", "tagId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "taggable_tags_tag"("taggableId", "tagId")
            SELECT "taggableId",
                "tagId"
            FROM "temporary_taggable_tags_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_taggable_tags_tag"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_f902ad3ed24a9a54fc472c5d9e" ON "taggable_tags_tag" ("tagId")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_588807f7d1c5e998731532011e" ON "taggable_tags_tag" ("taggableId")
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_94862f47938b19000073ff519e"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_c5791210d4a8ff4c680ae09619"
        `)
    await queryRunner.query(`
            ALTER TABLE "taggable"
                RENAME TO "temporary_taggable"
        `)
    await queryRunner.query(`
            CREATE TABLE "taggable" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "parentId" integer,
                "dateModified" date NOT NULL,
                "hide" boolean NOT NULL DEFAULT (0),
                "name" varchar,
                "type" varchar NOT NULL,
                "directoryPath" varchar,
                "sourceId" integer,
                "thumbnailId" integer,
                "coverId" integer,
                "fileIndexPath" varchar,
                "fileIndexFilename" varchar,
                "dimensionsWidth" integer,
                "dimensionsHeight" integer,
                CONSTRAINT "REL_8d0c7d640b6c2ce8050b2eed9e" UNIQUE ("thumbnailId"),
                CONSTRAINT "REL_c3976209f1848ec405744090fa" UNIQUE ("coverId"),
                CONSTRAINT "UQ_cfc57fc056ece1491065fb769ef" UNIQUE ("fileIndexPath")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "taggable"(
                    "id",
                    "parentId",
                    "dateModified",
                    "hide",
                    "name",
                    "type",
                    "directoryPath",
                    "sourceId",
                    "thumbnailId",
                    "coverId",
                    "fileIndexPath",
                    "fileIndexFilename",
                    "dimensionsWidth",
                    "dimensionsHeight"
                )
            SELECT "id",
                "parentId",
                "dateModified",
                "hide",
                "name",
                "type",
                "directoryPath",
                "sourceId",
                "thumbnailId",
                "coverId",
                "fileIndexPath",
                "fileIndexFilename",
                "dimensionsWidth",
                "dimensionsHeight"
            FROM "temporary_taggable"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_taggable"
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_94862f47938b19000073ff519e" ON "taggable" ("fileIndexFilename")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_c5791210d4a8ff4c680ae09619" ON "taggable" ("dateModified")
        `)
    await queryRunner.query(`
            ALTER TABLE "tag"
                RENAME TO "temporary_tag"
        `)
    await queryRunner.query(`
            CREATE TABLE "tag" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "label" varchar,
                "tagOrder" integer,
                "color" varchar,
                "groupId" integer NOT NULL
            )
        `)
    await queryRunner.query(`
            INSERT INTO "tag"("id", "label", "tagOrder", "color", "groupId")
            SELECT "id",
                "label",
                "tagOrder",
                "color",
                "groupId"
            FROM "temporary_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_tag"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_5eb55ef07f8d576539391092b2"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_74682ae37bad85f073ed99081d"
        `)
    await queryRunner.query(`
            DROP TABLE "directory_auto_tags_tag"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_f902ad3ed24a9a54fc472c5d9e"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_588807f7d1c5e998731532011e"
        `)
    await queryRunner.query(`
            DROP TABLE "taggable_tags_tag"
        `)
    await queryRunner.query(`
            DROP TABLE "thumbnail"
        `)
    await queryRunner.query(`
            DROP TABLE "directory"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_94862f47938b19000073ff519e"
        `)
    await queryRunner.query(`
            DROP INDEX "IDX_c5791210d4a8ff4c680ae09619"
        `)
    await queryRunner.query(`
            DROP TABLE "taggable"
        `)
    await queryRunner.query(`
            DROP TABLE "tag"
        `)
    await queryRunner.query(`
            DROP TABLE "tag_group"
        `)
  }
}
