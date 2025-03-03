import { v4 as generateUuid } from 'uuid'
import { API_EVENT_SOURCE } from './constants.js'

export class WiseEvent<Content extends object = object> {
  public readonly id: string
  public readonly topic: string
  public readonly createdAt: Date
  public readonly content: Content
  public readonly version: number
  public readonly source: string
  public readonly type: string

  constructor (options: {
    topic: string
    content: Content
    version: number
    type: string
  }) {
    this.id = generateUuid()
    this.createdAt = new Date()
    this.topic = options.topic
    this.content = options.content
    this.version = options.version
    this.source = API_EVENT_SOURCE
    this.type = options.type
  }
}
