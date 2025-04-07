import { expect, ExpectationResult, MatcherFunction } from 'expect'
import { SinonStubbedInstance } from 'sinon'
import { DomainEvent } from '../../src/modules/domain-events/domain-event.js'
import { DomainEventEmitter } from '../../src/modules/domain-events/domain-event-emitter.js'

export const toHaveEmitted: MatcherFunction<[DomainEvent]> = function (
  received: SinonStubbedInstance<DomainEventEmitter>,
  event: DomainEvent
): ExpectationResult {
  const expectedEvent = expect.objectContaining({
    content: event.content,
    source: event.source,
    type: event.type,
    version: event.version
  })

  const calls = [...received.emit.getCalls(), ...received.emitOne.getCalls()]
  const events = calls.flatMap(call => call?.firstArg as DomainEvent[] | DomainEvent | undefined)
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
    toHaveEmitted: (event: DomainEvent) => ExpectationResult
  }
  interface Matchers<R> {
    toHaveEmitted: (event: DomainEvent) => R
  }
}
