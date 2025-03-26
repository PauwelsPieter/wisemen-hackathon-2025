import { before, describe, it } from 'node:test'
import { assert, createStubInstance, SinonStubbedInstance } from 'sinon'
import { expect } from 'expect'
import { v4 } from 'uuid'
import { EntityNotFoundError, Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { AuthStorage } from '../../../../auth/auth.storage.js'
import { DeleteFileUseCase } from '../delete-file.use-case.js'

describe('Delete file use case unit tests', () => {
  let useCase: DeleteFileUseCase

  let userUuid: string

  let fileRepository: SinonStubbedInstance<Repository<File>>

  before(() => {
    TestBench.setupUnitTest()

    userUuid = v4()

    const authStorage = createStubInstance(AuthStorage, {
      getUserUuid: userUuid
    })

    fileRepository = createStubInstance<Repository<File>>(
      Repository<File>
    )

    useCase = new DeleteFileUseCase(
      authStorage,
      fileRepository
    )
  })

  it('should return 404 when file not uploaded by customer', async () => {
    fileRepository.findOneByOrFail.throws(new EntityNotFoundError(File, {}))

    await expect(useCase.execute(v4())).rejects.toThrow()
    assert.notCalled(fileRepository.delete)
  })
})
