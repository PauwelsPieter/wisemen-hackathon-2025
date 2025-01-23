import { describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { Repository } from 'typeorm'
import { RedisClient } from '../../redis/redis.client.js'
import { Role } from '../entities/role.entity.js'
import { RoleEntityBuilder } from '../tests/builders/entities/role-entity.builder.js'
import { Permission } from '../../permission/permission.enum.js'
import { RoleCache } from './role-cache.service.js'

describe('User cache unit test', () => {
  describe('Resetting role permissions', () => {
    it('Should fail when redis throws an error', () => {
      const redisClient = createStubInstance(RedisClient)
      const roleRepository = createStubInstance(Repository<Role>)

      const roleCache = new RoleCache(redisClient, roleRepository)

      redisClient.deleteCachedValues.rejects(new Error('Redis is down'))

      const promise = roleCache.clearRolesPermissions([randomUUID()])

      expect(promise).rejects.toThrow()
    })

    it('Should succeed in clearing roles', () => {
      const redisClient = createStubInstance(RedisClient)
      const roleRepository = createStubInstance(Repository<Role>)

      const roleCache = new RoleCache(redisClient, roleRepository)

      redisClient.deleteCachedValues.resolves()

      const promise = roleCache.clearRolesPermissions([randomUUID()])

      expect(promise).resolves.not.toThrow()
    })
  })

  describe('Retrieving role permissions', () => {
    it('Should return permissions when redis throws an error', async () => {
      const redisClient = createStubInstance(RedisClient)
      const roleRepository = createStubInstance(Repository<Role>)

      const roleCache = new RoleCache(redisClient, roleRepository)

      const role = new RoleEntityBuilder()
        .withPermissions([Permission.READ_ONLY])
        .build()

      redisClient.getCachedValues.rejects(new Error('Redis is down'))
      roleRepository.findBy.resolves([role])

      const permissions = await roleCache.getRolesPermissions([role.uuid])

      expect(permissions).toEqual(role.permissions)
    })

    it('Should return permissions when redis is functioning', async () => {
      const redisClient = createStubInstance(RedisClient)
      const roleRepository = createStubInstance(Repository<Role>)

      const roleCache = new RoleCache(redisClient, roleRepository)

      const role = new RoleEntityBuilder()
        .withPermissions([Permission.READ_ONLY])
        .build()

      redisClient.getCachedValues.resolves([JSON.stringify(role.permissions)])

      const permissions = await roleCache.getRolesPermissions([role.uuid])

      expect(permissions).toEqual(role.permissions)
    })

    it('Should return all permissions when partial roles are cached', async () => {
      const redisClient = createStubInstance(RedisClient)
      const roleRepository = createStubInstance(Repository<Role>)

      const roleCache = new RoleCache(redisClient, roleRepository)

      const contactRole = new RoleEntityBuilder()
        .withPermissions([Permission.CONTACT_READ])
        .build()

      const userRole = new RoleEntityBuilder()
        .withPermissions([Permission.USER_READ])
        .build()

      const values = [JSON.stringify(contactRole.permissions), null]

      redisClient.getCachedValues.resolves(values)
      roleRepository.findBy.resolves([userRole])

      const permissions = await roleCache.getRolesPermissions([contactRole.uuid, userRole.uuid])
      const expectedPermissions = [...contactRole.permissions, ...userRole.permissions]

      expect(permissions).toEqual(expectedPermissions)
    })
  })
})
