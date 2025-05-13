import { CloudEvent } from '../../../../integration-events/cloud-event.js'
import { NatsPipeTransform } from './nats-pipe-transform.js'

/**
 * Extracts the data field from a cloud event.
 * Does not validate that the data is a valid cloud event. See NatsMsgDataCloudEventValidationPipe.
 */
export class NatsMsgDataCloudEventValidationPipe implements NatsPipeTransform {
  transform (value: CloudEvent): unknown {
    return value.data
  }
}
