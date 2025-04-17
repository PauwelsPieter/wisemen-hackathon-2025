import { Injectable } from '@nestjs/common'
import { LocalizationContext } from '../../../modules/localization/localization-context.js'
import { UserUuid } from '../../users/entities/user.uuid.js'
import { UIPreferencesEntityBuilder } from './ui-preferences.entity.builder.js'
import { UiPreferences } from './ui-preferences.entity.js'

@Injectable()
export class DefaultUiPreferencesFactory {
  constructor (
    private readonly localizationContext: LocalizationContext
  ) {}

  create (forUserUuid: UserUuid): UiPreferences {
    return new UIPreferencesEntityBuilder()
      .withUserUuid(forUserUuid)
      .withLanguage(this.localizationContext.locale)
      .build()
  }
}
