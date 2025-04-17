import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'
import { Notification } from '../../entities/notification.entity.js'
import { NotificationType } from '../../enums/notification-types.enum.js'
import { NotificationEntityBuilder } from '../../entity-builders/notification.entity.builder.js'
import { DomainEventEmitter } from '../../../domain-events/domain-event-emitter.js'
import { Serializable } from '../../../../utils/types/serializable.js'
import { UserUuid } from '../../../../app/users/entities/user.uuid.js'
import { NotificationCreatedEvent } from './notification-created.event.js'
import { NotificationCreatedResponse } from './notification-created.response.js'

@Injectable()
export class CreateNotificationUseCase {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>
  ) {}

  async createNotification (
    createdByUserUuid: UserUuid | null,
    type: NotificationType,
    meta: Serializable
  ): Promise<NotificationCreatedResponse> {
    const notification = new NotificationEntityBuilder()
      .withCreatedByUserUuid(createdByUserUuid)
      .withType(type)
      .withMeta(meta)
      .build()

    await transaction(this.dataSource, async () => {
      await this.notificationRepo.insert(notification)
      await this.eventEmitter.emitOne(new NotificationCreatedEvent(notification.uuid, type))
    })

    return new NotificationCreatedResponse(notification.uuid)
  }
}
