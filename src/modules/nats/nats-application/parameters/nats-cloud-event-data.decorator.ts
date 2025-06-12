import { ClassConstructor } from 'class-transformer'
import { NatsPipeTransform } from './pipes/nats-pipe-transform.js'
import { NatsMessageData } from './nats-message-data.decorator.js'
import { NatsMsgDataJsonPipe } from './pipes/nats-message-data-json.pipe.js'
import { NatsMsgDataCloudEventValidationPipe } from './pipes/nats-message-cloud-event-validation.pipe.js'
import { NatsMsgDataValidationPipe } from './pipes/nats-message-data-validation.pipe.js'

/**
 * This parameter decorator is a shorthand for NatsMessageData with some preconfigured pipes:
 *  - NatsMessageDataJsonPipe
 *  - NatsMessageDataCloudEventValidationPipe
 *  - NatsMessageDataValidationPipe
 *
 * The data of the cloud event will be validated to be the parameter type (with class validator)
 * @param pipes Additional pipes for the cloud event data
 */
export function NatsCloudEventData (
  ...pipes: ClassConstructor<NatsPipeTransform>[]
): ParameterDecorator {
  return NatsMessageData(
    NatsMsgDataJsonPipe,
    NatsMsgDataCloudEventValidationPipe,
    NatsMsgDataValidationPipe,
    ...pipes
  )
}
