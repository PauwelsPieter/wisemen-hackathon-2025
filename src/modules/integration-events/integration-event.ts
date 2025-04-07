import { randomUUID } from 'crypto'
import * as os from 'node:os'
import { Serializable } from '../../utils/types/serializable.js'
import { IntegrationEventType } from './integration-event.type.js'

/**
 * Represents an event which originates from this system, and is sent to other external systems
 * Follows the spec from https://cloud.google.com/eventarc/docs/workflows/cloudevents
 */
export class IntegrationEvent {
  id: string
  time: string
  contentType: string
  source: string
  type: IntegrationEventType
  specVersion: string
  data: Serializable

  constructor (options: {
    type: IntegrationEventType
    version: string | number
    data: Serializable
  }) {
    this.id = randomUUID()
    this.source = os.hostname()
    this.time = new Date().toISOString()
    this.type = options.type
    this.specVersion = String(options.version)
    this.contentType = 'application/json'
    this.data = options.data
  }
}
