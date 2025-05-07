import { AuthorizationError, connect, ConnectionOptions, NatsConnection } from '@nats-io/transport-node'
import { ClassConstructor } from 'class-transformer'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getNatsConnectionOptions } from './nats-client.decorator.js'

export class NatsConnectionManager {
  private connections: Map<string, NatsConnection> = new Map()

  constructor (
    private readonly configService: ConfigService
  ) {}

  async connectWith (client: ClassConstructor<unknown>): Promise<NatsConnection> {
    const existingConnection = this.connections.get(client.name)
    if (existingConnection !== undefined) {
      return existingConnection
    }

    const connectionOptions = getNatsConnectionOptions(client)(this.configService)

    const newConnection = await this.connect(connectionOptions)
    this.connections.set(client.name, newConnection)
    return newConnection
  }

  async connect (connectionOptions: ConnectionOptions): Promise<NatsConnection> {
    try {
      const connection = await connect(connectionOptions)
      Logger.log(`Connected to server(s) ${connection.getServer()} as ${connectionOptions.name ?? 'anonymous'}`, 'NATS')
      return connection
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw new Error('Failed to connect to nats', { cause: error })
      } else {
        throw error
      }
    }
  }

  async drainConnections (): Promise<void> {
    const connections = this.connections.entries()
    for (const [name, connection] of connections) {
      Logger.debug(`Draining connection ${name}:...`, 'NATS')
      await connection.drain()
      Logger.debug(`Draining connection ${name}: drained`, 'NATS')
    }
  }
}
