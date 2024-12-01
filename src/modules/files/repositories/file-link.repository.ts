import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { FileLink } from '../entities/file-link.entity.js'

@Injectable()
export class FileLinkRepository extends TypeOrmRepository<FileLink> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(FileLink, entityManager)
  }
}
