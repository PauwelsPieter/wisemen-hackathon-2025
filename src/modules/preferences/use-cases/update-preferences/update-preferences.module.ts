import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Preferences } from '../../entities/preferences.entity.js'
import { UpdatePreferencesUseCase } from './update-preferences.use-case.js'
import { UpdatePreferencesController } from './update-preferences.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Preferences])
  ],
  controllers: [
    UpdatePreferencesController
  ],
  providers: [
    UpdatePreferencesUseCase
  ]
})
export class UpdatePreferencesModule { }
