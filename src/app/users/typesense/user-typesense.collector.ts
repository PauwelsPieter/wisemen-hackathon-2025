import { Injectable } from '@nestjs/common'
import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { TypesenseCollector } from '../../../modules/typesense/services/collectors/typesense-collector.factory.js'
import { User } from '../entities/user.entity.js'
import { UserUuid } from '../entities/user.uuid.js'
import { TypesenseUser } from './typesense-user.js'

@Injectable()
export class UserTypesenseCollector implements TypesenseCollector {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  transform (users: User[]): TypesenseUser[] {
    return users.map(user => new TypesenseUser(user))
  }

  async fetch (uuids?: UserUuid[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { uuid: AnyOrIgnore(uuids) },
      relations: { userRoles: { role: true } }
    })
  }

  async fetchChanged (since: Date): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { updatedAt: MoreThanOrEqual(since) },
        { userRoles: { role: { updatedAt: MoreThanOrEqual(since) } } }
      ],
      relations: { userRoles: { role: true } }
    })
  }

  async fetchRemoved (_since: Date): Promise<string[]> {
    return Promise.resolve([])
  }
}
