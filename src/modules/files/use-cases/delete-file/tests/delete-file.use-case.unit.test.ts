import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { assert, createStubInstance, SinonStubbedInstance } from 'sinon'
import { expect } from 'expect'
import { EntityNotFoundError, Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { DeleteFileUseCase } from '../delete-file.use-case.js'
import { AuthContext } from '../../../../auth/auth.context.js'

describe('Delete file use case unit tests', () => {
  let useCase: DeleteFileUseCase

  let userUuid: string

  let fileRepository: SinonStubbedInstance<Repository<File>>

  before(() => {
    TestBench.setupUnitTest()

    userUuid = randomUUID()

    const authStorage = createStubInstance(AuthContext, { getUserUuid: userUuid })

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

    await expect(useCase.execute(randomUUID())).rejects.toThrow()
    assert.notCalled(fileRepository.delete)
  })
})
