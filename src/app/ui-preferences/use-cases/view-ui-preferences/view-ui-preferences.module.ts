import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { DefaultUiPreferencesFactory } from '../../entities/default-ui-preferences.factory.js'
import { LocalizationModule } from '../../../../modules/localization/modules/localization.module.js'
import { ViewUiPreferencesIndexUseCase } from './view-ui-preferences.use-case.js'
import { ViewUiPreferencesController } from './view-ui-preferences.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UiPreferences]),
    LocalizationModule
  ],
  controllers: [
    ViewUiPreferencesController
  ],
  providers: [
    ViewUiPreferencesIndexUseCase,
    DefaultUiPreferencesFactory
  ]
})
export class ViewUiPreferencesModule { }
