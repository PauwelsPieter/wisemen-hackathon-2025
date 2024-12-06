import { Injectable } from '@nestjs/common'
import { AnyOrIgnore } from '../../../../utils/typeorm/operators/any-or-ignore.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'
import {
  UserSearchTransformer,
  type UserSearchTransformerType
} from '../../transformers/user.transformer.js'
import type { User } from '../../../users/entities/user.entity.js'
import type { TypesenseCollector } from './typesense-collector.factory.js'

@Injectable()
export class UserTypesenseCollector implements TypesenseCollector {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  transform (users: User[]): UserSearchTransformerType[] {
    return new UserSearchTransformer().array(users)
  }

  async fetch (uuids?: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { uuid: AnyOrIgnore(uuids) },
      relations: { userRoles: { role: true } }
    })
  }
}
