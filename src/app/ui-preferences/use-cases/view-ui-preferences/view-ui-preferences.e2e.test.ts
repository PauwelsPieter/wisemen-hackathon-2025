import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { TestAuthContext } from '../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { UiTheme } from '../../enums/theme.enum.js'
import { EndToEndTestSetup } from '../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../test/setup/test-bench.js'
import { FontSize } from '../../enums/font-size.enum.js'
import { Locale } from '../../../../modules/localization/enums/locale.enum.js'

describe('View ui preferences e2e', () => {
  let setup: EndToEndTestSetup
  let context: TestAuthContext
  let user: TestUser

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext
    user = await context.getUser([])
  })

  after(async () => await setup.teardown())

  describe('View preferences', () => {
    it('should return 401 when viewing preferences without a token', async () => {
      const response = await request(setup.httpServer)
        .get('/me/ui-preferences')

      expect(response).toHaveStatus(401)
    })

    it('should return 200 for own preferences', async () => {
      const response = await request(setup.httpServer)
        .get('/me/ui-preferences')
        .set('Authorization', `Bearer ${user.token}`)
        .set('Accept-Language', 'en-US')

      expect(response).toHaveStatus(200)
      expect(response.body).toEqual({
        theme: UiTheme.SYSTEM,
        language: Locale.EN_US,
        fontSize: FontSize.DEFAULT,
        showShortcuts: false,
        reduceMotion: false,
        highContrast: false
      })
    })
  })
})
