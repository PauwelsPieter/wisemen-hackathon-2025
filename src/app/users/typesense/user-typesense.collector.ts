import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { User } from '../entities/user.entity.js'
import { UserUuid } from '../entities/user.uuid.js'
import { RegisterTypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.js'
import { TypesenseUser } from './typesense-user.js'

@RegisterTypesenseCollector(TypesenseCollectionName.USER)
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
