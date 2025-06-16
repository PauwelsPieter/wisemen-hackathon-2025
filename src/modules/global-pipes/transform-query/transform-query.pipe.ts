import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { parse } from 'qs'

export class TransformQueryPipe implements PipeTransform {
  transform (value: object, metadata: ArgumentMetadata): object {
    if (metadata.type === 'query' && metadata.data === undefined) {
      return parse(value as Record<string, string>)
    } else {
      return value
    }
  }
}
