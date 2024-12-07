import { Test, type TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module.js'
import { TwilioService } from '../../src/modules/twilio/twilio.service.js'
import { TwilioMockService } from '../../src/modules/twilio/twilio.service.mock.js'
import { EventEmitter } from '../../src/modules/events/event-emitter.js'

export async function compileTestModule (): Promise<TestingModule> {
  const imports = [AppModule.forRoot()]

  return await Test.createTestingModule({ imports })
    .overrideProvider(TwilioService)
    .useClass(TwilioMockService)
    .overrideProvider(EventEmitter)
    .useClass(EventEmitter)
    .compile()
}
