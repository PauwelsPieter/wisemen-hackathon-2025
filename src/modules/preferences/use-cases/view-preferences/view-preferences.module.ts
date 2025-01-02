import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Preferences } from '../../entities/preferences.entity.js'
import { ViewPreferencesIndexUseCase } from './view-preferences.use-case.js'
import { ViewPreferencesController } from './view-preferences.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Preferences])
  ],
  controllers: [
    ViewPreferencesController
  ],
  providers: [
    ViewPreferencesIndexUseCase
  ]
})
export class ViewPreferencesModule { }
