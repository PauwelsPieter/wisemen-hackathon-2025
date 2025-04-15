import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import { ApiBadRequestErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { MigrationAlreadyPerformedError } from '../../errors/migration-already-performed.error.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { MigrateNotificationTypesUseCase } from './migrate-notification-types.use-case.js'
import { MigrateNotificationTypesCommand } from './migrate-notification-types.command.js'

@ApiTags('Notifications')
@Controller('notifications/migrate')
export class MigrateNotificationTypesController {
  constructor (
    private readonly useCase: MigrateNotificationTypesUseCase
  ) {}

  @Post()
  @Permissions(Permission.NOTIFICATION_MIGRATE_TYPE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiBadRequestErrorResponse(MigrationAlreadyPerformedError)
  async migrateNotificationTypes (
    @Body() command: MigrateNotificationTypesCommand
  ): Promise<void> {
    await this.useCase.execute(command)
  }
}
