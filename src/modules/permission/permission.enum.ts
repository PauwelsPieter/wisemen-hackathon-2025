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

  ROLE_READ = 'role.read',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  SEND_PUSH_NOTIFICATION = 'send_push_notification',

  TYPESENSE = 'typesense',

  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete'
}
