import { Server } from 'http'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { TestAuthContext } from '../utils/test-auth-context.js'

export class EndToEndTestSetup {
  public static async create (
    { app, testModule, dataSource, authContext }: {
      app: NestExpressApplication
      testModule: TestingModule
      dataSource: DataSource
      authContext: TestAuthContext
    }
  ): Promise<EndToEndTestSetup> {
    const setup = new EndToEndTestSetup(app, testModule, dataSource, authContext)

    await setup.initialize()

    return setup
  }

  private constructor (
    public readonly app: NestExpressApplication,
    public readonly testModule: TestingModule,
    public readonly dataSource: DataSource,
    public readonly authContext: TestAuthContext
  ) {}

  private async initialize (): Promise<void> {
    await this.dataSource.manager.queryRunner?.startTransaction()
  }

  public async teardown (): Promise<void> {
    await this.dataSource.manager.queryRunner?.rollbackTransaction()
  }

  public get httpServer (): Server {
    return this.app.getHttpServer()
  }
}
