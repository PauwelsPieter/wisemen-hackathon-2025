import { Test, type TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module.js'
import { TwilioService } from '../../src/modules/twilio/twilio.service.js'
import { TwilioMockService } from '../../src/modules/twilio/twilio.service.mock.js'

export async function compileTestModule (): Promise<TestingModule> {
  const imports = [AppModule.forRoot([], true)]

  return await Test.createTestingModule({ imports })
    .overrideProvider(TwilioService)
    .useClass(TwilioMockService)
    .compile()
}
