import assert from 'node:assert'
import { JsMsg } from '@nats-io/jetstream'
import { Msg } from '@nats-io/transport-node'
import { Type } from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { addNatsParameter, NatsParameter } from './nats-parameter.js'
import { NatsPipeTransform } from './pipes/nats-pipe-transform.js'
import { NatsParameterMetadata } from './nats-parameter-metadata.js'

class NatsMessageDataParameter implements NatsParameter {
  readonly index: number
  private readonly pipes: NatsPipeTransform[]
  private readonly metadata: NatsParameterMetadata

  constructor (index: number, pipes: NatsPipeTransform[], meta: NatsParameterMetadata) {
    this.index = index
    this.pipes = pipes
    this.metadata = meta
  }

  async value (message: Msg | JsMsg): Promise<unknown> {
    let value: unknown = message.data
    for (const pipe of this.pipes) {
      value = await pipe.transform(value, this.metadata)
    }
    return value
  }
}

/** Injects the data of the message */
export function NatsMessageData (
  ...pipes: ClassConstructor<NatsPipeTransform>[]
): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)
    const types = Reflect.getMetadata('design:paramtypes', target, methodName) as Type<unknown>[]
    const pipeInstances = pipes.map(pipe => new pipe())

    addNatsParameter(target, methodName, new NatsMessageDataParameter(
      index,
      pipeInstances,
      { metaType: (types)[index] })
    )
  }
}
