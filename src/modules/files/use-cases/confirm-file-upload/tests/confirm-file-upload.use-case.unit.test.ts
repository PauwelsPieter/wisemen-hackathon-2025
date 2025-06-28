import { before, describe, it } from 'node:test'
import { assert, createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { ConfirmFileUploadUseCase } from '../confirm-file-upload.use-case.js'
import { File } from '../../../entities/file.entity.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'
import { FileEntityBuilder } from '../../../entities/file-entity.builder.js'
import { FileUploadedEvent } from '../file-uploaded.event.js'
import { UserUuid } from '../../../../../app/users/entities/user.uuid.js'
import { generateUuid } from '../../../../../utils/types/uuid.js'

describe('Confirm file upload use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the file does not exist', async () => {
    const userUuid = generateUuid<UserUuid>()
    const authContext = createStubInstance(AuthContext, { getUserUuid: userUuid })
    const fileRepository = createStubInstance(Repository<File>)
    fileRepository.findOneBy.resolves(null)

    const useCase = new ConfirmFileUploadUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      authContext,
      fileRepository
    )

    await expect(useCase.execute(generateUuid())).rejects.toThrow()
    assert.notCalled(fileRepository.update)
  })

  it('emits an event when the file has been marked as uploaded', async () => {
    const userUuid = generateUuid<UserUuid>()
    const authContext = createStubInstance(AuthContext, { getUserUuid: userUuid })
    const fileRepository = createStubInstance(Repository<File>)
    const file = new FileEntityBuilder().build()
    fileRepository.findOneBy.resolves(file)

    const eventEmitter = createStubInstance(DomainEventEmitter)
    const useCase = new ConfirmFileUploadUseCase(
      stubDataSource(),
      eventEmitter,
      authContext,
      fileRepository
    )

    await useCase.execute(generateUuid())

    expect(eventEmitter).toHaveEmitted(new FileUploadedEvent(file))
  })
})
