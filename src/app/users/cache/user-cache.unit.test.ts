import { describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { Repository } from 'typeorm'
import { RedisClient } from '../../../modules/redis/redis.client.js'
import { User } from '../entities/user.entity.js'
import { UserEntityBuilder } from '../tests/user-entity.builder.js'
import { UserRoleEntityBuilder } from '../../roles/tests/builders/entities/user-role-entity.builder.js'
import { UserCache } from './user-cache.service.js'

describe('User cache unit test', () => {
  describe('Set user roles', () => {
    it('Should fail when redis throws an error', () => {
      const redisClient = createStubInstance(RedisClient)
      const userRepository = createStubInstance(Repository<User>)

      const userCache = new UserCache(redisClient, userRepository)

      redisClient.putCachedValue.rejects(new Error('Redis is down'))

      const promise = userCache.setUserRoles(randomUUID(), [randomUUID()])

      expect(promise).rejects.toThrow()
    })

    it('Should succeed in setting user roles', () => {
      const redisClient = createStubInstance(RedisClient)
      const userRepository = createStubInstance(Repository<User>)

      const userCache = new UserCache(redisClient, userRepository)

      redisClient.putCachedValue.resolves()

      const promise = userCache.setUserRoles(randomUUID(), [randomUUID()])

      expect(promise).resolves.not.toThrow()
    })
  })

  describe('Get user roles', () => {
    it('Should return roles when redis has no cache', async () => {
      const redisClient = createStubInstance(RedisClient)
      const userRepository = createStubInstance(Repository<User>)

      const userCache = new UserCache(redisClient, userRepository)

      const userRole = new UserRoleEntityBuilder().build()
      const user = new UserEntityBuilder().build()

      user.userRoles = [userRole]

      redisClient.getCachedValue.resolves(null)
      userRepository.findOne.resolves(user)

      const roles = await userCache.getUserRoles(user.uuid)

      expect(roles).toEqual([userRole.roleUuid])
    })

    it('Should return roles when redis is functioning', async () => {
      const redisClient = createStubInstance(RedisClient)
      const userRepository = createStubInstance(Repository<User>)

      const userCache = new UserCache(redisClient, userRepository)

      const userRole = new UserRoleEntityBuilder().build()
      const user = new UserEntityBuilder().build()

      user.userRoles = [userRole]

      redisClient.getCachedValue.resolves(JSON.stringify([userRole.roleUuid]))

      const roles = await userCache.getUserRoles(user.uuid)

      expect(roles).toEqual([userRole.roleUuid])
    })
  })
})
