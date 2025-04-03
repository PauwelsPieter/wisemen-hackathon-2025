import { describe, it } from 'node:test'
import { Test } from '@nestjs/testing'
import { expect } from 'expect'
import { MetricsModule } from '../../utils/opentelemetry/metrics/metrics.module.js'

describe('Metrics tests', () => {
  async function testMetricsStartup (): Promise<void> {
    const module = await Test.createTestingModule({
      imports: [MetricsModule]
    }).compile()

    return module.close()
  }

  it(`Metrics module starts successfully`, async () => {
    await expect(testMetricsStartup()).resolves.not.toThrow()
  })
})
