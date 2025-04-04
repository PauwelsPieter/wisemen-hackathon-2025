import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { LocalizationModule } from '../../../../modules/localization/modules/localization.module.js'
import { DefaultUiPreferencesFactory } from '../../entities/default-ui-preferences.factory.js'
import { UpdateUiPreferencesUseCase } from './update-ui-preferences.use-case.js'
import { UpdateUiPreferencesController } from './update-ui-preferences.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UiPreferences]),
    LocalizationModule
  ],
  controllers: [
    UpdateUiPreferencesController
  ],
  providers: [
    UpdateUiPreferencesUseCase,
    DefaultUiPreferencesFactory
  ]
})
export class UpdateUiPreferencesModule { }
