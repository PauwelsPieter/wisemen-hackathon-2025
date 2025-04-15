import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiNoContentResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'

@ApiTags('Role')
@Controller('roles/:role')
@ApiOAuth2([])
export class DeleteRoleController {
  constructor (
    private readonly useCase: DeleteRoleUseCase
  ) {}

  @Delete()
  @Permissions(Permission.ROLE_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deleteRole (
    @UuidParam('role') uuid: string
  ): Promise<void> {
    await this.useCase.execute(uuid)
  }
}
