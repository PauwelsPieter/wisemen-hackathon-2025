import assert from 'node:assert'
import { JsMsg } from '@nats-io/jetstream'
import { Msg } from '@nats-io/transport-node'
import { addNatsParameter, NatsParameter } from './nats-parameter.js'

class NatsMessageSubjectParameter implements NatsParameter {
  constructor (
    readonly index: number
  ) {}

  value (message: Msg | JsMsg): unknown {
    return message.subject
  }
}

/** Injects the subject of the message */
export function NatsMessageSubject (): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)
    addNatsParameter(target, methodName, new NatsMessageSubjectParameter(index))
  }
}
