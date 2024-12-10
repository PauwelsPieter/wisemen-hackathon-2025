import { Test, type TestingModule } from '@nestjs/testing'
import { DynamicModule, Type } from '@nestjs/common'
import { AppModule } from '../../src/app.module.js'
import { TwilioService } from '../../src/modules/twilio/twilio.service.js'
import { TwilioMockService } from '../../src/modules/twilio/twilio.service.mock.js'
import { EventEmitter } from '../../src/modules/events/event-emitter.js'

export async function compileTestModule (
  modules: Array<DynamicModule | Type<unknown>> = []
): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      AppModule.forRoot(),
      ...modules
    ]
  })
    .overrideProvider(TwilioService)
    .useClass(TwilioMockService)
    .overrideProvider(EventEmitter)
    .useClass(EventEmitter)
    .compile()
}
