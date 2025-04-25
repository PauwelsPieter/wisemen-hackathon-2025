import { ServiceMsg } from '@nats-io/services'
import { QueuedIterator } from '@nats-io/transport-node'

export type ServiceMessageHandlerFunction = (message: ServiceMsg) => Promise<unknown>

export class NatsServiceEndpointHandler {
  constructor (
    private readonly endpoint: QueuedIterator<ServiceMsg>,
    private readonly handler: ServiceMessageHandlerFunction
  ) {}

  async listen (): Promise<void> {
    for await (const message of this.endpoint) {
      void this.handleMessageOnEndpoint(message)
    }
  }

  private async handleMessageOnEndpoint (message: ServiceMsg): Promise<void> {
    try {
      const response = await this.handler(message)
      if (response instanceof Uint8Array) {
        message.respond(response)
      } else {
        message.respond(new TextEncoder().encode(JSON.stringify(response)))
      }
    } catch (e) {
      message.respondError(500, (e as Error).message, JSON.stringify(e))
    }
  }
}
