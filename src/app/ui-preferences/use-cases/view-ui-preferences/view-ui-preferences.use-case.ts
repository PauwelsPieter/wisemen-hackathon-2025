import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { UiPreferences } from '../../entities/ui-preferences.entity.js'
import { AuthContext } from '../../../../modules/auth/auth.context.js'
import { DefaultUiPreferencesFactory } from '../../entities/default-ui-preferences.factory.js'
import { ViewUiPreferencesResponse } from './view-ui-preferences.response.js'

@Injectable()
export class ViewUiPreferencesIndexUseCase {
  constructor (
    private readonly authContext: AuthContext,
    private readonly defaultUiPreferencesFactory: DefaultUiPreferencesFactory,
    @InjectRepository(UiPreferences)
    private preferencesRepository: TypeOrmRepository<UiPreferences>
  ) {}

  async execute (): Promise<ViewUiPreferencesResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()
    let preference = await this.preferencesRepository.findOneBy({ userUuid })

    if (preference == null) {
      preference = this.defaultUiPreferencesFactory.create(userUuid)
      await this.preferencesRepository.insert(preference)
    }

    return new ViewUiPreferencesResponse(preference)
  }
}
