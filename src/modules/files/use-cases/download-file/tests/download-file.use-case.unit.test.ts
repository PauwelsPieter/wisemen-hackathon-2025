import { before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { assert, createStubInstance, SinonStubbedInstance } from 'sinon'
import { expect } from 'expect'
import { EntityNotFoundError, Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { DownloadFileUseCase } from '../download-file.use-case.js'
import { S3Service } from '../../../services/s3.service.js'
import { AuthContext } from '../../../../auth/auth.context.js'

describe('Download file use case unit tests', () => {
  let useCase: DownloadFileUseCase

  let userUuid: string

  let fileRepository: SinonStubbedInstance<Repository<File>>
  let s3Service: SinonStubbedInstance<S3Service>

  before(() => {
    TestBench.setupUnitTest()

    userUuid = randomUUID()

    const authStorage = createStubInstance(AuthContext, {
      getUserUuid: userUuid
    })

    fileRepository = createStubInstance<Repository<File>>(
      Repository<File>
    )

    s3Service = createStubInstance(S3Service)

    useCase = new DownloadFileUseCase(
      authStorage,
      fileRepository,
      s3Service
    )
  })

  it('should return 404 when file not uploaded by customer', async () => {
    fileRepository.findOneByOrFail.throws(new EntityNotFoundError(File, {}))

    await expect(useCase.execute(randomUUID())).rejects.toThrow()
    assert.notCalled(s3Service.createTemporaryDownloadUrl)
  })
})
