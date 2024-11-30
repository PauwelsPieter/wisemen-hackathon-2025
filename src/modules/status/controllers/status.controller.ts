import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { ApiStatusType } from '../types/api-status.type.js'
import { Public } from '../../permission/permission.decorator.js'

@ApiTags('Default')
@Controller({
  version: ''
})
export class StatusController {
  constructor (
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Public()
  getApiStatus (): ApiStatusType {
    return {
      environment: this.configService.getOrThrow('NODE_ENV'),
      commit: this.configService.getOrThrow('BUILD_COMMIT'),
      version: this.configService.getOrThrow('BUILD_NUMBER'),
      timestamp: this.configService.getOrThrow('BUILD_TIMESTAMP')
    }
  }

  @Get('/health')
  @Public()
  getHealthStatus (): { status: string } {
    return { status: 'OK' }
  }
}
