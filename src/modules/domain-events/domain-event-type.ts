export enum DomainEventType {
  CONTACT_CREATED = 'contact.created',
  CONTACT_UPDATED = 'contact.updated',
  CONTACT_DELETED = 'contact.deleted',

  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_READ = 'notification.read',
  NOTIFICATION_UNREAD = 'notification.unread',
  NOTIFICATION_TYPES_MIGRATED = 'notification.types.migrated',
  NOTIFICATION_PREFERENCE_PRESET_UPDATED = 'notification.preference.preset.updated',

  ROLE_CREATED = 'role.created',
  ROLE_DELETED = 'role.deleted',
  ROLE_RENAMED = 'role.renamed',
  ROLE_PERMISSIONS_UPDATED = 'role.permissions.updated',

  USER_CREATED = 'user.created',
  USER_ROLE_ASSIGNED = 'user.role-assigned',
  USER_NOTIFICATION_CREATED = 'user.notification.created'
}
