export enum Permission {
  ALL_PERMISSIONS = 'all_permissions',

  CONTACT_CREATE = 'contact.create',
  CONTACT_READ = 'contact.read',
  CONTACT_UPDATE = 'contact.update',
  CONTACT_DELETE = 'contact.delete',

  EVENT_LOG_READ = 'event-log.read',

  FILE_READ = 'file.read',
  FILE_CREATE = 'file.create',
  FILE_DELETE = 'file.delete',

  JOBS_READ_INDEX = 'jobs.read.index',
  JOBS_READ_DETAIL = 'jobs.read.detail',

  NOTIFICATION_READ_OWN = 'notification.read.own',
  NOTIFICATION_READ_CONFIG = 'notification.read.config',
  NOTIFICATION_UPDATE_READ = 'notification.update.read',
  NOTIFICATION_UPDATE_UNREAD = 'notification.update.unread',
  NOTIFICATION_PREFERENCES_UPDATE_CHANNEL = 'notification.preferences.update.channel',
  NOTIFICATION_PREFERENCES_UPDATE_PRESET = 'notification.preferences.update.preset',
  NOTIFICATION_PREFERENCES_UPDATE_TYPES = 'notification.preferences.update.types',
  NOTIFICATION_PREFRENCES_READ_OWN = 'notification.preferences.read.own',
  NOTIFICATION_MIGRATE_TYPE = 'notification.migrate-type',

  ROLE_READ = 'role.read',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',
  ROLE_CACHE_CLEAR = 'role.cache.clear',

  SEND_PUSH_NOTIFICATION = 'send_push_notification',

  TYPESENSE = 'typesense',

  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete'

}
