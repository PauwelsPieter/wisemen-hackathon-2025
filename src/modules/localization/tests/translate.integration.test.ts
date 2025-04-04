import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { TestBench } from '../../../../test/setup/test-bench.js'
import { t, tr } from '../helpers/translate.helper.js'
import { MISSING_TRANSLATION_KEY } from '../constants/defaults.constant.js'
import { EndToEndTestSetup } from '../../../../test/setup/end-to-end-test-setup.js'

describe('Translate integration tests', () => {
  let setup: EndToEndTestSetup

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
  })

  after(async () => {
    await setup.teardown()
  })

  it('falls back to the default translation for an unknown key', () => {
    const unknownKey = 'unkown.key'
    const translation = tr(unknownKey)
    const expectedTranslation = t(MISSING_TRANSLATION_KEY, { args: { key: unknownKey } })

    expect(translation).toBe(expectedTranslation)
  })
})
