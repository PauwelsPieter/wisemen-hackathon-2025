import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Public } from '../../../permission/permission.decorator.js'
import { GetApiInfoResponse } from './get-api-info.response.js'

@ApiTags('API Status')
@Controller({
  version: ''
})
export class GetApiInfoController {
  constructor (
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'API info retrieved',
    type: GetApiInfoResponse
  })
  getApiInfo (
  ): GetApiInfoResponse {
    return new GetApiInfoResponse(
      this.configService.getOrThrow('NODE_ENV'),
      this.configService.getOrThrow('BUILD_COMMIT'),
      this.configService.getOrThrow('BUILD_NUMBER'),
      this.configService.getOrThrow('BUILD_TIMESTAMP')
    )
  }
}
