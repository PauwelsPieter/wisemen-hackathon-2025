import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { AssignDefaultRoleToUserUseCase } from '../assign-default-role-to-user.use-case.js'
import { AssignDefaultRoleToUserRepository } from '../assign-default-role-to-user.repository.js'
import { RoleEntityBuilder } from '../../../../roles/tests/builders/entities/role-entity.builder.js'
import { RoleAssignedToUserEvent } from '../role-assigned-to-user.event.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EventEmitter } from '../../../../../modules/events/event-emitter.js'

describe('Assign default tole to user use case', () => {
  before(() => TestBench.setupUnitTest())

  it('assigns a role to the user', async () => {
    const repository = createStubInstance(AssignDefaultRoleToUserRepository)

    repository.getDefaultRole.resolves(new RoleEntityBuilder().build())

    const useCase = new AssignDefaultRoleToUserUseCase(
      stubDataSource(),
      createStubInstance(EventEmitter),
      repository
    )

    const userUuid = randomUUID()

    await useCase.assignDefaultRole(userUuid)

    expect(repository.insert.called).toBe(true)
  })

  it('emits an event when a role has been assigned to a user', async () => {
    const role = new RoleEntityBuilder().build()
    const repository = createStubInstance(AssignDefaultRoleToUserRepository)

    repository.getDefaultRole.resolves(role)

    const eventEmitter = createStubInstance(EventEmitter)

    const useCase = new AssignDefaultRoleToUserUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    const userUuid = randomUUID()

    await useCase.assignDefaultRole(userUuid)

    expect(eventEmitter).toHaveEmitted(new RoleAssignedToUserEvent(userUuid, role.uuid))
  })
})
