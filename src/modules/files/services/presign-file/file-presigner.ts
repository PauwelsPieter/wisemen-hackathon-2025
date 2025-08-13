import { Injectable } from '@nestjs/common'
import { SECONDS_PER_MINUTE } from '@wisemen/time'
import { S3 } from '../../../s3/s3.js'
import { File } from '../../entities/file.entity.js'
import { PresignedFile } from '../../entities/presigned-file.js'
import { PresignedFileBuilder } from '../../entities/presigned-file.builder.js'
import { S3Key } from '../../../s3/s3-key.js'
import { sanitizeS3Key } from '../../../s3/sanitize-s3-key.js'

@Injectable()
export class FilePresigner {
  constructor (
    private readonly s3: S3
  ) {}

  async presign (file: File): Promise<PresignedFile> {
    const builder = new PresignedFileBuilder()
      .withFile(file)
      .withUrl(await this.createDownloadUrl(file, file.key))

    await Promise.all(file.variants.map(async variant =>
      builder.addVariant({
        label: variant.label,
        url: await this.createDownloadUrl(file, sanitizeS3Key(file.key + '-' + variant.label))
      })
    ))

    return builder.build()
  }

  private async createDownloadUrl (file: File, key: S3Key): Promise<string> {
    return await this.s3.createTemporaryDownloadUrl(
      file.name,
      key,
      file.mimeType,
      2 * SECONDS_PER_MINUTE
    )
  }
}
