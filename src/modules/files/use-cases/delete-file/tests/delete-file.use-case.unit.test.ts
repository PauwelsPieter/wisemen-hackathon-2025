import { before, describe, it } from 'node:test'
import { assert, createStubInstance } from 'sinon'
import { expect } from 'expect'
import { EntityNotFoundError, Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { DeleteFileUseCase } from '../delete-file.use-case.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { generateUserUuid } from '../../../../../app/users/entities/user.uuid.js'
import { generateFileUuid } from '../../../entities/file.uuid.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'
import { FileEntityBuilder } from '../../../tests/builders/entities/file-entity.builder.js'
import { FileDeletedEvent } from '../file-deleted.event.js'

describe('Delete file use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the file does not exist', async () => {
    const userUuid = generateUserUuid()
    const authStorage = createStubInstance(AuthContext, { getUserUuid: userUuid })

    const fileRepository = createStubInstance(Repository<File>)
    fileRepository.findOneByOrFail.throws(new EntityNotFoundError(File, {}))

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new DeleteFileUseCase(
      stubDataSource(),
      eventEmitter,
      authStorage,
      fileRepository
    )

    await expect(useCase.execute(generateFileUuid())).rejects.toThrow()
    assert.notCalled(fileRepository.delete)
  })

  it('emit an event when the file has been deleted', async () => {
    const userUuid = generateUserUuid()
    const authStorage = createStubInstance(AuthContext, { getUserUuid: userUuid })

    const fileRepository = createStubInstance(Repository<File>)
    const file = new FileEntityBuilder().build()
    fileRepository.findOneByOrFail.resolves(file)

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new DeleteFileUseCase(
      stubDataSource(),
      eventEmitter,
      authStorage,
      fileRepository
    )

    await useCase.execute(generateFileUuid())

    expect(eventEmitter).toHaveEmitted(new FileDeletedEvent(file))
  })
})
