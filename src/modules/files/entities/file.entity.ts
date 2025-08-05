import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, OneToMany, type Relation, ManyToOne } from 'typeorm'
import type { MimeType } from '../enums/mime-type.enum.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'
import { User } from '../../../app/users/entities/user.entity.js'
import { SanitizedS3Key } from '../../s3/sanitized-s3-key.js'
import { FileLink } from './file-link.entity.js'
import { FileUuid } from './file.uuid.js'
import { FileVariant } from './file-variant.type.js'

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  uuid: FileUuid

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  mimeType: MimeType

  @Column({ type: 'boolean', default: false })
  isUploadConfirmed: boolean

  @OneToMany(() => FileLink, fileLink => fileLink.file)
  fileEntities?: Array<Relation<FileLink>>

  @Column({ type: 'varchar', default: () => 'uuid_generate_v4()' })
  key: SanitizedS3Key

  @Column({ type: 'jsonb', default: [] })
  variants: FileVariant[]

  @Column({ type: 'varchar', nullable: true })
  blurHash: string | null

  @Column({ type: 'uuid', nullable: true })
  uploaderUuid: UserUuid | null

  @ManyToOne(() => User)
  uploader?: Relation<User> | null
}
