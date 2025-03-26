import { Controller, Delete } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
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
  async deleteRole (
    @UuidParam('role') uuid: string
  ): Promise<void> {
    await this.useCase.execute(uuid)
  }
}
