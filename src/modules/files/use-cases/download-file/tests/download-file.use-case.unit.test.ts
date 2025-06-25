import { before, describe, it } from 'node:test'
import { assert, createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { File } from '../../../entities/file.entity.js'
import { DownloadFileUseCase } from '../download-file.use-case.js'
import { generateFileUuid } from '../../../entities/file.uuid.js'
import { FilePresigner } from '../../../services/presign-file/file-presigner.js'

describe('Download file use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('should return 404 when the file does not exist', async () => {
    const fileRepository = createStubInstance(Repository<File>)
    fileRepository.findOneBy.resolves(null)

    const filePresigner = createStubInstance(FilePresigner)
    const useCase = new DownloadFileUseCase(
      fileRepository,
      filePresigner
    )

    await expect(useCase.execute(generateFileUuid())).rejects.toThrow()
    assert.notCalled(filePresigner.presign)
  })
})
