/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { NatsParameterMetadata } from '../nats-parameter-metadata.js'

export interface NatsPipeTransform {
  transform(value: unknown, metadata: NatsParameterMetadata): Promise<unknown> | unknown
}
