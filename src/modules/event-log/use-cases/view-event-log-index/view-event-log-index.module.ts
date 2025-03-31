import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { EventLog } from '../../event-log.entity.js'
import { ViewEventLogIndexUseCase } from './view-event-log-index.use-case.js'
import { ViewEventLogIndexController } from './view-event-log-index.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([EventLog])
  ],
  controllers: [ViewEventLogIndexController],
  providers: [
    ViewEventLogIndexUseCase
  ]
})
export class ViewEventLogIndexModule {}
