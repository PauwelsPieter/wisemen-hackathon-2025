import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { GetOrCreateUserUseCase } from '../get-or-create-user.use-case.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { GetOrCreateUserRepository } from '../get-or-create-user.repository.js'
import { UserEntityBuilder } from '../../../tests/user-entity.builder.js'
import { GetOrCreateUserCommandBuilder } from '../get-or-create-user.command.builder.js'
import { UserCreatedEvent } from '../user-created.event.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EventEmitter } from '../../../../../modules/events/event-emitter.js'

describe('Get or create user use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('does not create a new user when one already exists', async () => {
    const repository = createStubInstance(GetOrCreateUserRepository)

    repository.findById.resolves(new UserEntityBuilder().build())

    const useCase = new GetOrCreateUserUseCase(
      stubDataSource(),
      createStubInstance(EventEmitter),
      repository
    )

    const command = new GetOrCreateUserCommandBuilder().build()

    await useCase.getOrCreateUser(command)

    expect(repository.insert.called).toBe(false)
  })

  it('creates a new user when no user exists yet', async () => {
    const repository = createStubInstance(GetOrCreateUserRepository)

    repository.findById.resolves(null)

    const useCase = new GetOrCreateUserUseCase(
      stubDataSource(),
      createStubInstance(EventEmitter),
      repository
    )

    const command = new GetOrCreateUserCommandBuilder().build()

    await useCase.getOrCreateUser(command)

    expect(repository.insert.called).toBe(true)
  })

  it('emits an event when a user is created', async () => {
    const repository = createStubInstance(GetOrCreateUserRepository)

    repository.findById.resolves(null)

    const eventEmitter = createStubInstance(EventEmitter)
    const useCase = new GetOrCreateUserUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    const command = new GetOrCreateUserCommandBuilder().build()

    const user = await useCase.getOrCreateUser(command)

    expect(eventEmitter).toHaveEmitted(new UserCreatedEvent(user.uuid))
  })
})
