import { app } from 'electron'
import { DataSource } from 'typeorm'
import { TaggableImage } from './entities/TaggableImage'
import { Directory } from './entities/Directory'
import { Tag } from './entities/Tag'
import { TagGroup } from './entities/TagGroup'
import { Taggable } from './entities/Taggable'
import { TaggableFile } from './entities/TaggableFile'
import { Thumbnail } from './entities/Thumbnail'
import { TaggableStack } from './entities/TaggableStack'
import { APP_DIR, DEV_DIR } from '../common/appDir'
import { InitDatabase1730761117956 } from './migrations/1730761117956-InitDatabase'
import { NsfwTags1746577567101 } from './migrations/1746577567101-nsfwTags'
import { NsfwPrivateRename1763407600185 } from './migrations/1763407600185-nsfwPrivateRename'
import { DefaultExcluded1776607995921 } from './migrations/1776607995921-defaultExcluded'

const path = app.getPath('appData')

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: `${path}/impart/${import.meta.env.DEV ? DEV_DIR : APP_DIR}/db.sqlite`,
  entities: [
    Directory,
    Tag,
    TagGroup,
    Taggable,
    TaggableFile,
    TaggableImage,
    TaggableStack,
    Thumbnail
  ],
  migrations: [
    InitDatabase1730761117956,
    NsfwTags1746577567101,
    NsfwPrivateRename1763407600185,
    DefaultExcluded1776607995921
  ],
  migrationsTableName: '__migrations',
  migrationsRun: true,
  logging: app.isPackaged ? false : ['error', 'warn', 'info']
})

