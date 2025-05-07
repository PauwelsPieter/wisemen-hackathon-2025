import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { convertValidationErrorToJsonApiError } from '../../../../global-pipes/validation/convert-validation-errors.js'
import { NatsParameterMetadata } from '../nats-parameter-metadata.js'
import { NatsPipeTransform } from './nats-pipe-transform.js'

export class NatsMsgDataValidationPipe implements NatsPipeTransform {
  async transform (value: unknown, metadata: NatsParameterMetadata): Promise<unknown> {
    if (metadata.metaType === undefined) {
      throw new Error(`Could not determine type of paramater.`
        + `\nIs the parameter typed and not imported as a type?`)
    }

    const instance = plainToInstance(metadata.metaType, value) as object
    const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw convertValidationErrorToJsonApiError(errors)
    }

    return instance
  }
}
