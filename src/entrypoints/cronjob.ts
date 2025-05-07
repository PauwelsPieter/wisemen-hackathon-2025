import { startOpentelemetryTracing } from '../utils/opentelemetry/otel-tracer-sdk.js'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { AppModule } from '../app.module.js'
import { CronjobModule } from '../modules/cronjobs/cronjob.module.js'
import { CronjobType } from '../modules/cronjobs/cronjob-type.enum.js'
import { CronjobUseCase } from '../modules/cronjobs/cronjob.use-case.js'

const args = await yargs(hideBin(process.argv))
  .usage('$0 <type>', 'Run the specified cronjob')
  .positional('type', {
    describe: 'Type of cronjob to run',
    type: 'string',
    choices: Object.values(CronjobType),
    demandOption: true
  })
  .help()
  .argv

startOpentelemetryTracing()

export class Cronjob extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([
        CronjobModule.forRootAsync({
          type: args.type as unknown as CronjobType
        })
      ])
    )
  }

  async execute (app: INestApplicationContext): Promise<void> {
    const cronjobUseCase = app.get<CronjobUseCase>('CronjobUseCase')

    await cronjobUseCase.execute()
  }
}
const _cronjob = new Cronjob()
