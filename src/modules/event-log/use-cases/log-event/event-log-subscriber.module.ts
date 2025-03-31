import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { EventLog } from '../../event-log.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { EventLogSubscriber } from './event-log.subscriber.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([EventLog]),
    AuthModule
  ],
  providers: [EventLogSubscriber]
})
export class EventLogSubscriberModule {}
