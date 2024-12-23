import { Module } from '@nestjs/common'
import { ViewPreferencesModule } from './use-cases/view-preferences/view-preferences.module.js'
import { UpdatePreferencesModule } from './use-cases/update-preferences/update-preferences.module.js'

@Module({
  imports: [
    UpdatePreferencesModule,
    ViewPreferencesModule
  ]
})
export class PreferencesModule { }
