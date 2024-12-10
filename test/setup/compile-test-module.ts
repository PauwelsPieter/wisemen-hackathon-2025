import { Test, type TestingModule } from '@nestjs/testing'
import { DynamicModule, Type } from '@nestjs/common'
import { AppModule } from '../../src/app.module.js'
import { TwilioService } from '../../src/modules/twilio/twilio.service.js'
import { TwilioMockService } from '../../src/modules/twilio/twilio.service.mock.js'

export async function compileTestModule (
  modules?: Array<DynamicModule | Type<unknown>>
): Promise<TestingModule> {
  const imports = [AppModule.forRoot(modules, true)]

  return await Test.createTestingModule({ imports })
    .overrideProvider(TwilioService)
    .useClass(TwilioMockService)
    .compile()
}
