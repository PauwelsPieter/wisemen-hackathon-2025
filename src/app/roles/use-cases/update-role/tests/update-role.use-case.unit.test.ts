import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { RoleEntityBuilder } from '../../../entities/role.entity-builder.js'
import { RoleNotFoundError } from '../../../errors/role-not-found.error.js'
import { UpdateRoleRepository } from '../update-role.repository.js'
import { UpdateRoleUseCase } from '../update-role.use-case.js'
import { UpdateRoleCommandBuilder } from '../update-role-command.builder.js'
import { RoleRenamedEvent } from '../role-renamed.event.js'
import { RoleNameAlreadyInUseError } from '../../../errors/role-name-already-in-use.error.js'
import { generateRoleUuid } from '../../../entities/role.uuid.js'

describe('update role use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the role does not exist', async () => {
    const repository = createStubInstance(UpdateRoleRepository)
    repository.findRole.resolves(null)

    const useCase = new UpdateRoleUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    const command = new UpdateRoleCommandBuilder().build()

    await expect(async () => await useCase.execute(generateRoleUuid(), command))
      .rejects.toThrow(RoleNotFoundError)
  })

  it('throws an error when the name is already in use', async () => {
    const role = new RoleEntityBuilder()
      .withIsSystemAdmin(true)
      .build()

    const repository = createStubInstance(UpdateRoleRepository)
    repository.findRole.resolves(role)
    repository.isNameAlreadyInUse.resolves(true)

    const useCase = new UpdateRoleUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    const command = new UpdateRoleCommandBuilder().build()

    await expect(async () => await useCase.execute(role.uuid, command))
      .rejects.toThrow(RoleNameAlreadyInUseError)
  })

  it('emits an event when the role has been updated', async () => {
    const role = new RoleEntityBuilder().withName('name1').build()

    const repository = createStubInstance(UpdateRoleRepository)
    repository.findRole.resolves(role)
    repository.isNameAlreadyInUse.resolves(false)

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new UpdateRoleUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    const command = new UpdateRoleCommandBuilder().withName('name2').build()
    await useCase.execute(role.uuid, command)

    // expected role update
    role.name = command.name

    expect(eventEmitter).toHaveEmitted(new RoleRenamedEvent(role, 'name1'))
  })
})
