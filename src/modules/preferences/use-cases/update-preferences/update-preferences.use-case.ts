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
    const preferences = this.preferencesRepository.create(command)

    preferences.userUuid = userUuid

    await this.preferencesRepository.upsert(preferences, {
      conflictPaths: {
        userUuid: true
      }
    })
  }
}
