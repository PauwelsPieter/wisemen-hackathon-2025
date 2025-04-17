import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { User } from '../entities/user.entity.js'
import { UserUuid } from '../entities/user.uuid.js'

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor (entityManager: EntityManager) {
    super(User, entityManager)
  }

  async findWithUuids (
    userUuids: UserUuid[]
  ): Promise<User[]> {
    if (userUuids.length === 0) return []
    const usersQuery = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .andWhere('user.uuid IN (:...userUuids)', { userUuids })

    return await usersQuery.getMany()
  }
}
