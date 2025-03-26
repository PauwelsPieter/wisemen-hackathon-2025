import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { v4 } from 'uuid'
import { UpdateRolesPermissionsUseCase } from '../update-roles-permissions.use-case.js'
import { EventEmitter } from '../../../../../modules/events/event-emitter.js'
import { UpdateRolesPermissionsRepository } from '../update-roles-permissions.repository.js'
import { NotFoundCompositeApiError } from '../../../../../modules/exceptions/api-errors/not-found-composite.api-error.js'
import { RoleNotFoundError } from '../../../errors/role-not-found.error.js'
import { RolesPermissionsUpdatedEvent } from '../roles-permissions-updated.event.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { RoleNotEditableError } from '../../../errors/role-not-editable.error.js'
import {
  TypesenseCollectionService
} from '../../../../../modules/typesense/services/typesense-collection.service.js'
import { RoleEntityBuilder } from '../../../tests/builders/entities/role-entity.builder.js'
import { UpdateRolesPermissionsCommandBuilder } from './update-roles-permissions.command.builder.js'

describe('Update role permissions use case unit tests', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when a role does not exist', async () => {
    const repository = createStubInstance(UpdateRolesPermissionsRepository)

    repository.findRoles.resolves([])

    const useCase = new UpdateRolesPermissionsUseCase(
      stubDataSource(),
      createStubInstance(EventEmitter),
      repository,
      createStubInstance(TypesenseCollectionService)
    )

    const roleUuid = v4()
    const command = new UpdateRolesPermissionsCommandBuilder()
      .addRole(roleUuid, [])
      .build()

    await expect(useCase.updateRolePermissions(command)).rejects.toThrow(
      new NotFoundCompositeApiError([new RoleNotFoundError(roleUuid)])
    )
  })

  it('throws an error when a system admin role is changed', async () => {
    const repository = createStubInstance(UpdateRolesPermissionsRepository)

    const nonEditableRole = new RoleEntityBuilder()
      .withIsSystemAdmin(true)
      .build()

    repository.findRoles.resolves([nonEditableRole])

    const useCase = new UpdateRolesPermissionsUseCase(
      stubDataSource(),
      createStubInstance(EventEmitter),
      repository,
      createStubInstance(TypesenseCollectionService)
    )

    const command = new UpdateRolesPermissionsCommandBuilder()
      .addRole(nonEditableRole.uuid, [])
      .build()

    await expect(useCase.updateRolePermissions(command)).rejects.toThrow(
      new RoleNotEditableError(nonEditableRole)
    )
  })

  it('emits an event for each role', async () => {
    const role1Uuid = v4()
    const role2Uuid = v4()

    const repository = createStubInstance(UpdateRolesPermissionsRepository)
    const roles = [
      new RoleEntityBuilder()
        .withUuid(role1Uuid)
        .build(),
      new RoleEntityBuilder()
        .withUuid(role2Uuid)
        .build()
    ]

    repository.findRoles.resolves(roles)

    const eventEmitter = createStubInstance(EventEmitter)

    const useCase = new UpdateRolesPermissionsUseCase(
      stubDataSource(),
      eventEmitter,
      repository,
      createStubInstance(TypesenseCollectionService)
    )

    const command = new UpdateRolesPermissionsCommandBuilder()
      .addRole(role1Uuid, [])
      .addRole(role2Uuid, [])
      .build()

    await useCase.updateRolePermissions(command)
    expect(eventEmitter).toHaveEmitted(new RolesPermissionsUpdatedEvent(roles))
  })
})
