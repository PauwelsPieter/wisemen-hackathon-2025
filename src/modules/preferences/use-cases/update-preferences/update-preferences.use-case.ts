import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Preferences } from '../../entities/preferences.entity.js'
import { UpdatePreferencesCommand } from './update-preferences.command.js'

@Injectable()
export class UpdatePreferencesUseCase {
  constructor (
    @InjectRepository(Preferences)
    private preferencesRepository: Repository<Preferences>
  ) {}

  public async execute (
    userUuid: string,
    command: UpdatePreferencesCommand
  ): Promise<void> {
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
    } else {
      await this.preferencesRepository.update({
        uuid: preference.uuid
      }, command)
    }
  }
}
