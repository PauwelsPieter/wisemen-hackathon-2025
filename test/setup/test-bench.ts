import { after, mock } from 'node:test'
import process from 'node:process'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import { expect } from 'expect'
import { TestAuthContext } from '../utils/test-auth-context.js'
import { AuthMiddleware } from '../../src/modules/auth/middleware/auth.middleware.js'
import { S3Service } from '../../src/modules/files/services/s3.service.js'
import { uuid } from '../expect/expectUuid.js'
import { toHaveErrorCode } from '../expect/expectErrorCode.js'
import { toHaveStatus } from '../expect/expectStatus.js'
import { isEnumValue } from '../expect/expectEnum.js'
import { toHaveApiError } from '../expect/expect-api-error.js'
import { ApiModule } from '../../src/modules/api/api.module.js'
import { RepositoryTestSetup } from './repository-test-setup.js'
import { EndToEndTestSetup } from './end-to-end-test-setup.js'

after(async () => TestBench.tearDown())

export class TestBench {
  private static _app: NestExpressApplication | undefined
  private static _testModule: TestingModule | undefined
  private static _dataSource: DataSource | undefined
  private static _authContext: TestAuthContext | undefined
  private static _isUnitTestSetup: boolean = false
  private static _isEndToEndTestSetup: boolean = false

  public static async setupEndToEndTest (): Promise<EndToEndTestSetup> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV must be set to test')
    }

    this.setupUnitTest()
    await this.initApp()

    return await EndToEndTestSetup.create({
      app: this._app as NestExpressApplication,
      authContext: this._authContext as TestAuthContext,
      dataSource: this._dataSource as DataSource,
      testModule: this._testModule as TestingModule
    })
  }

  public static async setupRepositoryTest (): Promise<RepositoryTestSetup> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV must be set to test')
    }

    this.setupUnitTest()
    await this.initApp()

    return RepositoryTestSetup.create(this._dataSource as DataSource)
  }

  public static setupUnitTest (): void {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV must be set to test')
    }

    if (!this._isUnitTestSetup) {
      this.mockS3()
      this.extendExpect()
      dayjs.extend(customParseFormat)
      this._isUnitTestSetup = true
    }
  }

  public static async tearDown (): Promise<void> {
    await this._app?.close()
  }

  private static async initApp () {
    if (!this._isEndToEndTestSetup) {
      const testModule = await Test.createTestingModule({ imports: [ApiModule] }).compile()

      const [app, dataSource] = await Promise.all([
        this.initializeApp(testModule),
        this.initializeDatabaseConnection(testModule)
      ])

      const authContext = new TestAuthContext(dataSource.manager)

      this.mockAuth(authContext)

      this._app = app
      this._testModule = testModule
      this._dataSource = dataSource
      this._authContext = authContext

      this._isEndToEndTestSetup = true
    }
  }

  private static async initializeDatabaseConnection (testModule: TestingModule) {
    const dataSource = testModule.get(DataSource)
    const qr = dataSource.createQueryRunner()

    await qr.connect()
    Object.defineProperty(dataSource.manager, 'queryRunner', {
      configurable: true,
      value: qr
    })

    return dataSource
  }

  private static async initializeApp (testModule: TestingModule) {
    const app = testModule.createNestApplication<NestExpressApplication>()

    await app.init()

    return app
  }

  private static mockAuth (context: TestAuthContext): void {
    mock.method(AuthMiddleware.prototype, 'verify', async (token: string) => {
      const user = context.resolveUser(token)

      return Promise.resolve({ uuid: user.uuid })
    })
  }

  private static mockS3 (): void {
    mock.method(S3Service.prototype, 'createTemporaryDownloadUrl', () => 'http://localhost:3000')
    mock.method(S3Service.prototype, 'createTemporaryUploadUrl', () => 'http://localhost:3000')
    mock.method(S3Service.prototype, 'upload', () => {})
    mock.method(S3Service.prototype, 'uploadStream', () => {})
    mock.method(S3Service.prototype, 'delete', () => {})
    mock.method(S3Service.prototype, 'list', () => [])
  }

  private static extendExpect (): void {
    expect.extend({
      uuid,
      toHaveErrorCode,
      toHaveStatus,
      isEnumValue,
      toHaveApiError
    })
  }
}
