export interface NatsOutboxEvent {
  topic: string
  serializedMessage: string
}
