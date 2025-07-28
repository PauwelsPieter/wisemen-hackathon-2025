import type { Readable } from 'stream'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2Output,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Upload } from '@aws-sdk/lib-storage'
import { captureException } from '@sentry/nestjs'
import { MimeType } from '../files/enums/mime-type.enum.js'
import type { File } from '../files/entities/file.entity.js'
import { S3UnavailableError } from './s3-unavailable.error.js'

@Injectable()
export class S3 {
  private readonly _client?: S3Client

  constructor (
    private readonly configService: ConfigService
  ) {
    const region: string = this.configService.get('S3_REGION', 'nl-ams')

    try {
      this._client = new S3Client({
        forcePathStyle: true,
        region,
        endpoint: this.configService.getOrThrow('S3_ENDPOINT'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY'),
          secretAccessKey: this.configService.getOrThrow('S3_SECRET_KEY')
        }
      })
    } catch (error) {
      captureException(error)
    }
  }

  private get client (): S3Client {
    if (this._client == null) {
      throw new S3UnavailableError('The S3 client is not configured')
    } else {
      return this._client
    }
  }

  public async createTemporaryDownloadUrl (
    name: string,
    key: string,
    mimeType: MimeType,
    expiresInSeconds?: number
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.prependEnvKey(key),
      ResponseContentType: mimeType,
      ResponseContentDisposition: `attachment; filename=${name}`
    })

    const expiresIn = expiresInSeconds ?? 1800

    return await getSignedUrl(this.client, command, { expiresIn })
  }

  public async createTemporaryUploadUrl (file: File, expiresInSeconds?: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.prependEnvKey(file.key),
      ContentType: file.mimeType,
      ACL: 'private'
    })

    const expiresIn = expiresInSeconds ?? 180

    return await getSignedUrl(this.client, command, { expiresIn })
  }

  public async upload (
    key: string,
    content: Buffer
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.prependEnvKey(key),
      Body: content,
      ACL: 'private'
    })

    await this.client.send(command, {
      requestTimeout: 60_000
    })
  }

  public async uploadStream (
    key: string,
    stream: Readable
  ): Promise<void> {
    const parallelUploads = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: this.prependEnvKey(key),
        Body: stream,
        ACL: 'private'
      },
      queueSize: 10,
      leavePartsOnError: false
    })

    await parallelUploads.done()
  }

  public async list (
    key: string
  ): Promise<ListObjectsV2Output['Contents']> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: this.prependEnvKey(key)
    })

    const result = await this.client.send(command)

    return result.Contents
  }

  public async delete (
    key: string
  ): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: this.prependEnvKey(key)
    })

    await this.client.send(command)
  }

  private get bucketName (): string {
    try {
      return this.configService.getOrThrow('S3_BUCKET')
    } catch (error) {
      captureException(error)

      throw new S3UnavailableError('The S3 bucket is not configured')
    }
  }

  private prependEnvKey (
    key: string
  ): string {
    const env: string = this.configService.get('NODE_ENV', 'local')

    return `${env}/${key}`
  }
}
