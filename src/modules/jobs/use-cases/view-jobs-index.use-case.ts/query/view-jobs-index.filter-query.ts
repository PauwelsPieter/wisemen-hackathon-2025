import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsUndefinable, IsQueryBoolean } from '@wisemen/validators'
import { IsEnum, IsArray, ArrayMinSize } from 'class-validator'
import { QueuenameApiProperty, QueueName } from '../../../../pgboss/enums/queue-name.enum.js'

export class ViewJobsIndexFilterQuery extends FilterQuery {
  @QueuenameApiProperty({ required: false, isArray: true })
  @IsEnum(QueueName, { each: true })
  @IsUndefinable()
  @IsArray()
  @ArrayMinSize(1)
  queueNames?: QueueName[]

  @ApiProperty({ type: 'string', required: false, default: 'false' })
  @IsUndefinable()
  @IsQueryBoolean()
  archived?: string
}
