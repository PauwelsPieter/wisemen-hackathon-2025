import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Client } from '../entities/client.entity.js'

import { TypeOrmRepository } from '../../typeorm/typeorm.repository.js'

@Injectable()
export class ClientRepository extends TypeOrmRepository<Client> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Client, entityManager)
  }
}
