import { randomUUID } from 'node:crypto'
import { Uuid } from '../../../utils/types/uuid.js'

export type NotificationPrefrerencesUuid = Uuid<'NotificationPreferences'>

export function generateNotificationPreferencesUuid (): NotificationPrefrerencesUuid {
  return randomUUID() as NotificationPrefrerencesUuid
}
