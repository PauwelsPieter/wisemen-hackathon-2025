import { Injectable } from '@nestjs/common'
import { DataSource, TypeORMError } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { UserEntityBuilder } from '../../tests/user-entity.builder.js'
import { EventEmitter } from '../../../../modules/events/event-emitter.js'
import { UnauthorizedError } from '../../../../modules/exceptions/generic/unauthorized.error.js'
import { GetOrCreateUserCommand } from './get-or-create-user.command.js'
import { GetOrCreateUserRepository } from './get-or-create-user.repository.js'
import { UserCreatedEvent } from './user-created.event.js'

@Injectable()
export class GetOrCreateUserUseCase {
  constructor (
    private dataSource: DataSource,
    private eventEmitter: EventEmitter,
    private readonly repository: GetOrCreateUserRepository
  ) {}

  async getOrCreateUser (command: GetOrCreateUserCommand): Promise<User> {
    let user = await this.repository.findById(command.id)

    if (user != null) {
      return user
    }

    user = new UserEntityBuilder()
      .withEmail(command.email)
      .withFirstName(command.firstName)
      .withLastName(command.lastName)
      .withId(command.id)
      .build()

    try {
      await transaction(this.dataSource, async () => {
        await this.repository.insert(user)
        await this.eventEmitter.emit(new UserCreatedEvent(user.uuid))
      })
    } catch (e) {
      if (this.userHasBeenCreatedSimultaneously(e)) {
        return await this.refetchUser(command)
      } else {
        throw e
      }
    }

    return user
  }

  private async refetchUser (command: GetOrCreateUserCommand): Promise<User> {
    const user = await this.repository.findById(command.id)

    if (user != null) {
      return user
    } else {
      throw new UnauthorizedError()
    }
  }

  private userHasBeenCreatedSimultaneously (e: unknown): e is TypeORMError {
    return e instanceof TypeORMError
      && e.name === 'QueryFailedError'
      && e.message.startsWith('duplicate key')
  }
}
