import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class PingPongCommand {
  @ApiProperty({ type: String, description: 'random uuid' })
  @IsNotEmpty()
  @IsUUID()
  uuid: string
}
