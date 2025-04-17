import { before, describe, it } from 'node:test'
import { assert, createStubInstance, SinonStubbedInstance } from 'sinon'
import { expect } from 'expect'
import { EntityNotFoundError, Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { DeleteFileUseCase } from '../delete-file.use-case.js'
import { AuthContext } from '../../../../auth/auth.context.js'
import { generateUserUuid, UserUuid } from '../../../../../app/users/entities/user.uuid.js'
import { generateFileUuid } from '../../../entities/file.uuid.js'

describe('Delete file use case unit tests', () => {
  let useCase: DeleteFileUseCase

  let userUuid: UserUuid

  let fileRepository: SinonStubbedInstance<Repository<File>>

  before(() => {
    TestBench.setupUnitTest()

    userUuid = generateUserUuid()

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

    await expect(useCase.execute(generateFileUuid())).rejects.toThrow()
    assert.notCalled(fileRepository.delete)
  })
})
