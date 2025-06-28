import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { ClearRolePermissionsCacheUseCase } from '../clear-role-permissions-cache.use-case.js'
import { RoleCache } from '../../../cache/role-cache.service.js'
import { RolePermissionsCacheClearedEvent } from '../role-permissions-cache-cleared.event.js'
import { generateUuid } from '../../../../../utils/types/uuid.js'
import { RoleUuid } from '../../../entities/role.uuid.js'

describe('clear role permissions cache use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('clears the cache for the given roles', async () => {
    const repository = createStubInstance(Repository)
    const cache = createStubInstance(RoleCache)

    const useCase = new ClearRolePermissionsCacheUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      cache,
      repository
    )

    const rolesToClear = [generateUuid<RoleUuid>()]
    await useCase.execute(rolesToClear)

    expect(cache.clearRolesPermissions.firstCall.firstArg).toStrictEqual(rolesToClear)
    expect(repository.find.called).toBe(false)
  })

  it('clears the cache for all roles when no roles are given', async () => {
    const allRoles = [
      { uuid: randomUUID() },
      { uuid: randomUUID() }
    ]

    const repository = createStubInstance(Repository)
    repository.find.resolves(allRoles)
    const cache = createStubInstance(RoleCache)

    const useCase = new ClearRolePermissionsCacheUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      cache,
      repository
    )

    await useCase.execute()

    const rolesToClear = allRoles.map(role => role.uuid)
    expect(cache.clearRolesPermissions.firstCall.firstArg).toStrictEqual(rolesToClear)
  })

  it('emits an event after clearing the roles', async () => {
    const allRoles = [
      { uuid: randomUUID() },
      { uuid: randomUUID() }
    ]

    const repository = createStubInstance(Repository)
    repository.find.resolves(allRoles)
    const cache = createStubInstance(RoleCache)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new ClearRolePermissionsCacheUseCase(
      stubDataSource(),
      eventEmitter,
      cache,
      repository
    )

    await useCase.execute()

    const rolesToClear = allRoles.map(role => role.uuid)
    expect(eventEmitter).toHaveEmitted(new RolePermissionsCacheClearedEvent(rolesToClear))
  })
})
