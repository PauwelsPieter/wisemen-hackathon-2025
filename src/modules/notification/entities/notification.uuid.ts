import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type NotificationUuid = Uuid<'Notification'>

export function generateNotificationUuid (): NotificationUuid {
  return randomUUID() as NotificationUuid
}
