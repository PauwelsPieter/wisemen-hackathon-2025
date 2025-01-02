import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventEmitter } from './event-emitter.js'

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      ignoreErrors: false
    })
  ],
  providers: [EventEmitter],
  exports: [EventEmitter]
})
export class EventModule {}
