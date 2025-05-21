import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { UserNotification } from '../../entities/user-notification.entity.js'
import { LocalizationContext } from '../../../localization/localization-context.js'
import { DEFAULT_LIMIT } from '../../../typesense/param-builders/search-params.builder.js'
import { AuthContext } from '../../../auth/auth.context.js'
import { GetMyNotificationsQuery } from './query/get-my-notifications.query.js'
import { GetMyNotificationsResponse } from './get-my-notifications.response.js'

@Injectable()
export class GetMyNotificationsUseCase {
  constructor (
    @InjectRepository(UserNotification)
    private readonly repo: Repository<UserNotification>,
    private readonly authContext: AuthContext,
    private readonly localizationContext: LocalizationContext
  ) {}

  async getNotifications (
    query: GetMyNotificationsQuery
  ): Promise<GetMyNotificationsResponse> {
    const userUuid = this.authContext.getUserUuidOrFail()

    const queryBuilder = this.repo.createQueryBuilder('user_notification')
      .where('user_notification.userUuid = :userUuid', { userUuid })
      .leftJoinAndSelect('user_notification.notification', 'notification')
      .leftJoinAndSelect('notification.createdByUser', 'createdByUser')
      .orderBy('user_notification.createdAt', 'DESC')
      .addOrderBy('user_notification.notificationUuid', 'DESC')
      .take(query.pagination?.limit ?? DEFAULT_LIMIT)

    if (query.filter?.onlyUnread === 'true') {
      queryBuilder.andWhere('user_notification.readAt IS NULL')
    }

    if (query.pagination?.key != null) {
      queryBuilder.andWhere('(user_notification.createdAt, user_notification.notificationUuid) < (:createdAt, :notificationUuid)')
        .setParameter('createdAt', query.pagination.key.createdAt)
        .setParameter('notificationUuid', query.pagination.key.notificationUuid)
    }

    const userNotifications = await queryBuilder.getMany()

    return new GetMyNotificationsResponse(userNotifications)
  }
}
