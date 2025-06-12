import { randomUUID } from 'crypto'
import * as os from 'node:os'
import { Serializable } from '../../utils/types/serializable.js'
import { IntegrationEventType } from './integration-event.type.js'

/**
 * Represents an event which originates from this system, and is sent to other external systems
 * Follows the spec from https://cloud.google.com/eventarc/docs/workflows/cloudevents
 */
export class IntegrationEvent<Content extends Serializable = Serializable> {
  id: string
  time: string
  datacontenttype: string
  source: string
  type: IntegrationEventType
  specversion: string
  data: Content

  constructor (options: {
    type: IntegrationEventType
    version: string | number
    data: Content
  }) {
    this.id = randomUUID()
    this.source = os.hostname()
    this.time = new Date().toISOString()
    this.type = options.type
    this.specversion = String(options.version)
    this.datacontenttype = 'application/json'
    this.data = options.data
  }
}
