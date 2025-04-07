import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { DomainEventLog } from '../../domain-event-log.entity.js'
import { AuthModule } from '../../../auth/auth.module.js'
import { DomainEventLogSubscriber } from './domain-event-log.subscriber.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainEventLog]),
    AuthModule
  ],
  providers: [DomainEventLogSubscriber]
})
export class DomainEventLogSubscriberModule {}
