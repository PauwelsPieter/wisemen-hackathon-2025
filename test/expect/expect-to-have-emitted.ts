import { expect, ExpectationResult, MatcherFunction } from 'expect'
import { SinonStubbedInstance } from 'sinon'
import { WiseEvent } from '../../src/modules/events/wise-event.js'
import { EventEmitter } from '../../src/modules/events/event-emitter.js'

export const toHaveEmitted: MatcherFunction<[WiseEvent]>
  = function (received: SinonStubbedInstance<EventEmitter>, event: WiseEvent): ExpectationResult {
    const expectedEvent = expect.objectContaining({
      content: event.content,
      source: event.source,
      topic: event.topic,
      type: event.type,
      version: event.version
    })

    const calls = received?.emit?.getCalls()
    const events = calls.map(call => call?.firstArg as WiseEvent | undefined)
    const emitted = events?.some(event => this.equals(event, expectedEvent))

    if (emitted) {
      const stringifiedActual = this.utils.printReceived(events)
      const stringifiedExpected = this.utils.printExpected(expectedEvent)

      return {
        pass: true,
        message: () => `expected ${stringifiedActual} not to be ${stringifiedExpected}`
      }
    } else {
      return {
        pass: false,
        message: () => '\n' + this.utils.printDiffOrStringify(
          expectedEvent,
          events.length === 1 ? events[0] : events,
          'Expected event',
          'Emitted event(s)',
          false
        )
      }
    }
  }

declare module 'expect' {
  interface AsymmetricMatchers {
    toHaveEmitted: (event: WiseEvent) => ExpectationResult
  }
  interface Matchers<R> {
    toHaveEmitted: (event: WiseEvent) => R
  }
}
