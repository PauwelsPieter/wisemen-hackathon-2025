/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { JsMsg } from '@nats-io/jetstream'
import { Msg } from '@nats-io/transport-node'
import { ClassConstructor } from 'class-transformer'
import { getNatsParameters, MethodName, NatsParameter } from '../parameters/nats-parameter.js'

export class NatsMessageHandlerFunction {
  private readonly parameters: NatsParameter[]
  private _handle: (...args: unknown[]) => unknown | Promise<unknown>

  constructor ({ handlerClass, instance, methodName }: {
    handlerClass: ClassConstructor<unknown>
    instance: object
    methodName: MethodName
  }) {
    this.parameters = getNatsParameters(handlerClass, methodName)
    this._handle = instance[methodName].bind(instance) as (...args: unknown[]) => Promise<void>
  }

  async handle (message: Msg | JsMsg): Promise<unknown> {
    const args = await this.buildArguments(message)
    return await this._handle(...args)
  }

  private async buildArguments (message: Msg | JsMsg): Promise<unknown[]> {
    const args: unknown[] = Array.from({ length: this.parameters.length }, () => undefined)
    for (const parameter of this.parameters) {
      const value = await parameter.value(message)
      args[parameter.index] = value
    }
    return args
  }
}
