import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, IsString } from 'class-validator'
import { AiModelName } from './ai-model.enum.js'

export class CreateNaturalLanguageModelCommand {
  @ApiProperty({ type: String, example: 'gemini-model' })
  @IsString()
  @IsNotEmpty()
  modelId: string

  @ApiProperty({ type: String, enum: AiModelName, enumName: 'AiModelName' })
  @IsNotEmpty()
  @IsEnum(AiModelName)
  modelName: AiModelName
}
