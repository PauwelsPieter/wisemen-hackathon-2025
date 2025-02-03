import { DataSource } from 'typeorm'

export class RepositoryTestSetup {
  public static async create (dataSource: DataSource
  ): Promise<RepositoryTestSetup> {
    const setup = new RepositoryTestSetup(dataSource)

    await setup.initialize()

    return setup
  }

  private constructor (
    public readonly dataSource: DataSource
  ) {}

  private async initialize (): Promise<void> {
    await this.dataSource.manager.queryRunner?.startTransaction()
  }

  public async teardown (): Promise<void> {
    await this.dataSource.manager.queryRunner?.rollbackTransaction()
  }
}
