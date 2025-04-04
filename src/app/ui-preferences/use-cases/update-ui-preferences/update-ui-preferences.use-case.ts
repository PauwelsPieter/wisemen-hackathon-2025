import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { DefaultUiPreferencesFactory } from '../../entities/default-ui-preferences.factory.js'
import { AuthContext } from '../../../../modules/auth/auth.context.js'
import { UpdateUiPreferencesCommand } from './update-ui-preferences.command.js'

@Injectable()
export class UpdateUiPreferencesUseCase {
  constructor (
    private readonly authContext: AuthContext,
    private readonly defaultUiPreferencesFactory: DefaultUiPreferencesFactory,
    @InjectRepository(UiPreferences)
    private preferencesRepository: TypeOrmRepository<UiPreferences>
  ) {}

  public async execute (command: UpdateUiPreferencesCommand): Promise<void> {
    const userUuid = this.authContext.getUserUuidOrFail()
    let preferences = await this.preferencesRepository.findOneBy({ userUuid })

    if (preferences === null) {
      preferences = this.defaultUiPreferencesFactory.create(userUuid)
    }

    preferences.theme = command.theme ?? preferences.theme
    preferences.showShortcuts = command.showShortcuts ?? preferences.showShortcuts
    preferences.reduceMotion = command.reduceMotion ?? preferences.reduceMotion
    preferences.highContrast = command.highContrast ?? preferences.highContrast
    preferences.language = command.language ?? preferences.language
    preferences.fontSize = command.fontSize ?? preferences.fontSize

    await this.preferencesRepository.upsert(preferences, { conflictPaths: { userUuid: true } })
  }
}
