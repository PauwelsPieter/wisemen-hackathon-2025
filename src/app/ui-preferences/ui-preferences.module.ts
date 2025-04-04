import { Module } from '@nestjs/common'
import { ViewUiPreferencesModule } from './use-cases/view-ui-preferences/view-ui-preferences.module.js'
import { UpdateUiPreferencesModule } from './use-cases/update-ui-preferences/update-ui-preferences.module.js'

@Module({
  imports: [
    UpdateUiPreferencesModule,
    ViewUiPreferencesModule
  ]
})
export class UiPreferencesModule { }
