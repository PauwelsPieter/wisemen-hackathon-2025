import { type DynamicModule, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventEmitter } from './event-emitter.js'

@Module({})
export class EventModule {
  static forRoot (): DynamicModule {
    return {
      module: EventModule,
      imports: [
        EventEmitterModule.forRoot({
          wildcard: true,
          ignoreErrors: false
        })
      ],
      providers: [EventEmitter],
      exports: [EventEmitter]
    }
  }
}
