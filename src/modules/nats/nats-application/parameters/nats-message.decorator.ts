import assert from 'node:assert'
import { JsMsg } from '@nats-io/jetstream'
import { Msg } from '@nats-io/transport-node'
import { addNatsParameter, NatsParameter } from './nats-parameter.js'

class NatsMessageParameter implements NatsParameter {
  index: number

  constructor (index: number) {
    this.index = index
  }

  value (message: Msg | JsMsg): unknown {
    return message
  }
}

/** Injects the raw `Msg` or `JsMsg` */
export function NatsMessage (): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)
    addNatsParameter(target, methodName, new NatsMessageParameter(index))
  }
}
