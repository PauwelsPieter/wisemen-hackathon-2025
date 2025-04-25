import { before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { CreateFileUseCase } from '../create-file.use-case.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'
import { S3 } from '../../../../s3/s3.js'
import { FileEntityBuilder } from '../../../entities/file-entity.builder.js'
import { FileCreatedEvent } from '../file-created.event.js'
import { FileUuid } from '../../../entities/file.uuid.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { CreateFileCommandBuilder } from './create-file.command.builder.js'

describe('CreateFile use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('emits an event when a file is created', async () => {
    const command = new CreateFileCommandBuilder().build()

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const repository = createStubInstance(Repository)
    repository.create.returns({
      name: command.name,
      mimeType: command.mimeType,
      userUuid: randomUUID()
    })

    const s3 = createStubInstance(S3)
    const authContext = createStubInstance(AuthContext)
    authContext.getUserUuid.returns(null)

    const useCase = new CreateFileUseCase(
      stubDataSource(),
      eventEmitter,
      repository,
      s3,
      authContext
    )

    const response = await useCase.execute(command)

    const expectedFile = new FileEntityBuilder()
      .withUuid(response.uuid as FileUuid)
      .withName(command.name)
      .build()

    expect(eventEmitter).toHaveEmitted(new FileCreatedEvent(expectedFile))
  })
})
