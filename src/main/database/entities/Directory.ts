import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { Taggable } from './Taggable'
import { Tag } from './Tag'

@Entity()
export class Directory extends BaseEntity {
  @PrimaryColumn()
  path: string

  @Column({ nullable: false, default: false })
  recursive: boolean

  @OneToMany(() => Taggable, (t) => t.directory, { onDelete: 'CASCADE' })
  taggables: Taggable[]

  @ManyToMany(() => Tag, (t) => t.autoTagDirectories, { cascade: true })
  @JoinTable()
  autoTags?: Tag[]
}
