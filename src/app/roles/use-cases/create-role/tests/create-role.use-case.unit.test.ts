import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { CreateRoleUseCase } from '../create-role.use-case.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { CreateRoleRepository } from '../create-role.repository.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { CreateRoleCommandBuilder } from '../create-role.command.builder.js'
import { RoleNameAlreadyInUseError } from '../../../errors/role-name-already-in-use.error.js'
import { RoleEntityBuilder } from '../../../entities/role.entity-builder.js'
import { RoleCreatedEvent } from '../role-created.event.js'
import { RoleUuid } from '../../../entities/role.uuid.js'

describe('create role use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the role name is already in use', async () => {
    const repository = createStubInstance(CreateRoleRepository)
    repository.isNameAlreadyInUse.resolves(true)

    const useCase = new CreateRoleUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    const command = new CreateRoleCommandBuilder().build()

    await expect(async () => await useCase.execute(command))
      .rejects.toThrow(RoleNameAlreadyInUseError)
  })

  it('emits an event when the role has been created', async () => {
    const repository = createStubInstance(CreateRoleRepository)
    repository.isNameAlreadyInUse.resolves(false)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new CreateRoleUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    const command = new CreateRoleCommandBuilder().build()
    const response = await useCase.execute(command)

    const expectedRole = new RoleEntityBuilder()
      .withName(command.name)
      .withUuid(response.uuid as RoleUuid)
      .build()

    expect(eventEmitter).toHaveEmitted(new RoleCreatedEvent(expectedRole))
  })
})
