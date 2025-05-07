import { Type } from '@nestjs/common'

export interface NatsParameterMetadata {
  metaType?: Type<unknown>
}
