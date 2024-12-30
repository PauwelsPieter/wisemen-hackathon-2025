import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { AppModule } from '../app.module.js'
import { startTracers } from '../utils/opentelemetry/tracer.js'
import { CronjobModule } from '../modules/cronjobs/cronjob.module.js'
import { AbstractUseCase } from '../modules/cronjobs/use-cases/abstract-use-case.js'
import { CronjobType } from '../modules/cronjobs/enums/cronjob-type.enum.js'

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

export class Cronjob extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    startTracers(`cronjob:${args.type}`)

    return await NestFactory.createApplicationContext(
      AppModule.forRoot([
        CronjobModule.forRootAsync({
          type: args.type
        })
      ])
    )
  }

  async execute (app: INestApplicationContext): Promise<void> {
    const cronjobUseCase = app.get<AbstractUseCase>('CronjobUseCase')

    await cronjobUseCase.execute()
  }
}
const _cronjob = new Cronjob()
