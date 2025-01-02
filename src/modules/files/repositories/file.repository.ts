import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { File } from '../entities/file.entity.js'

@Injectable()
export class FileRepository extends TypeOrmRepository<File> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(File, entityManager)
  }
}
