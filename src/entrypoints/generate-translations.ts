import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { GenerateTranslationsModule } from '../modules/localization/modules/generate-translations.module.js'

async function translate (): Promise<void> {
  const app = await NestFactory.create(GenerateTranslationsModule)
  await app.init()
  Logger.log('Finished translating')
  await app.close()
}

translate().catch(err => Logger.error(err))
