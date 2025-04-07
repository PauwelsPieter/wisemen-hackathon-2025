import { Test, type TestingModule } from '@nestjs/testing'
import { DynamicModule, Type } from '@nestjs/common'
import { TwilioService } from '../../src/modules/twilio/twilio.service.js'
import { TwilioMockService } from '../../src/modules/twilio/twilio.service.mock.js'
import { DomainEventEmitter } from '../../src/modules/domain-events/domain-event-emitter.js'
import { TestModule } from './test.module.js'

export async function compileTestModule (
  modules: Array<DynamicModule | Type<unknown>> = [],
  migrationsRun = false
): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      TestModule.forRoot(modules, migrationsRun)
    ]
  })
    .overrideProvider(TwilioService)
    .useClass(TwilioMockService)
    .overrideProvider(DomainEventEmitter)
    .useClass(DomainEventEmitter)
    .compile()
}
