import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { RoleEntityBuilder } from '../../../entities/role.entity-builder.js'
import { DeleteRoleUseCase } from '../delete-role.use-case.js'
import { DeleteRoleRepository } from '../delete-role.repository.js'
import { RoleNotFoundError } from '../../../errors/role-not-found.error.js'
import { RoleDeletedEvent } from '../role-deleted.event.js'
import { RoleNotEditableError } from '../../../errors/role-not-editable.error.js'
import { generateRoleUuid } from '../../../entities/role.uuid.js'

describe('delete role use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the role does not exist', async () => {
    const repository = createStubInstance(DeleteRoleRepository)
    repository.findRole.resolves(null)

    const useCase = new DeleteRoleUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    await expect(async () => await useCase.execute(generateRoleUuid()))
      .rejects.toThrow(RoleNotFoundError)
  })

  it('throws an error when the role is the system admin', async () => {
    const role = new RoleEntityBuilder()
      .withIsSystemAdmin(true)
      .build()

    const repository = createStubInstance(DeleteRoleRepository)
    repository.findRole.resolves(role)

    const useCase = new DeleteRoleUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    await expect(async () => await useCase.execute(generateRoleUuid()))
      .rejects.toThrow(RoleNotEditableError)
  })

  it('emits an event when the role has been deleted', async () => {
    const role = new RoleEntityBuilder().build()

    const repository = createStubInstance(DeleteRoleRepository)
    repository.findRole.resolves(role)

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new DeleteRoleUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    await useCase.execute(generateRoleUuid())

    expect(eventEmitter).toHaveEmitted(new RoleDeletedEvent(role))
  })
})
