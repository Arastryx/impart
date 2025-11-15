import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TagGroup } from './TagGroup'
import { TaggableImage } from './TaggableImage'
import { Taggable } from './Taggable'
import { Directory } from './Directory'

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  label?: string

  @Column({ nullable: true })
  tagOrder: number

  @Column({ nullable: true })
  color?: string

  @Column({ nullable: false, default: false })
  isNsfw: boolean

  @ManyToOne(() => TagGroup, (g) => g.tags, { nullable: false, onDelete: 'CASCADE' })
  group?: TagGroup

  @ManyToMany(() => Taggable, (i) => i.tags)
  images?: Taggable[]

  @ManyToMany(() => Directory, (d) => d.autoTags)
  autoTagDirectories?: Directory[]
}
