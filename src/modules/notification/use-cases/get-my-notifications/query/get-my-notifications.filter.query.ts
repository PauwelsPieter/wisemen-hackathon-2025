import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '@wisemen/pagination'
import { IsUndefinable, IsQueryBoolean } from '@wisemen/validators'

export class GetMyNotificationsFilterQuery extends FilterQuery {
  @ApiProperty({ required: false, example: 'true or false' })
  @IsUndefinable()
  @IsQueryBoolean()
  onlyUnread?: string
}
