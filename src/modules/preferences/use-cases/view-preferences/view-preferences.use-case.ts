import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Preferences } from '../../entities/preferences.entity.js'
import { ViewPreferencesResponse } from './view-preferences.response.js'

@Injectable()
export class ViewPreferencesIndexUseCase {
  constructor (
    @InjectRepository(Preferences)
    private preferencesRepository: TypeOrmRepository<Preferences>
  ) { }

  public async execute (
    userUuid: string
  ): Promise<ViewPreferencesResponse> {
    let preference = await this.preferencesRepository.findOne({
      where: {
        userUuid
      }
    })

    if (preference == null) {
      preference = this.preferencesRepository.create({
        userUuid
      })

      await this.preferencesRepository.insert(preference)

      preference = await this.preferencesRepository.findOneOrFail({
        where: {
          userUuid
        }
      })
    }

    return new ViewPreferencesResponse(preference)
  }
}
