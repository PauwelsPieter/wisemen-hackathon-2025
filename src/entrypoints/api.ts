import '../utils/sentry/sentry.js'

import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, MiddlewareConsumer, Module, VersioningType } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApiContainer } from '@wisemen/app-container'
import { AuthMiddleware } from '../modules/auth/middleware/auth.middleware.js'
import { AuthModule } from '../modules/auth/auth.module.js'
import { UserModule } from '../modules/users/user.module.js'
import { RoleModule } from '../modules/roles/role.module.js'
import { PermissionModule } from '../modules/permission/permission.module.js'
import { StatusModule } from '../modules/status/modules/status.module.js'
import { FileModule } from '../modules/files/modules/file.module.js'
import { LocalizationModule } from '../modules/localization/modules/localization.module.js'
import { ContactModule } from '../modules/contact/contact.module.js'
import { AppModule } from '../app.module.js'
import { SwaggerModule } from '../modules/swagger/swagger.module.js'

@Module({
  imports: [
    AppModule.forRoot(),
    AuthModule,
    SwaggerModule,
    StatusModule,
    UserModule,
    RoleModule,
    PermissionModule,
    FileModule,
    LocalizationModule,
    ContactModule
  ]
})
class ApiModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/token')
      .forRoutes('*')
  }
}

class Api extends ApiContainer {
  async bootstrap (adapter: ExpressAdapter): Promise<INestApplicationContext> {
    const app = await NestFactory.create(ApiModule, adapter)

    app.setGlobalPrefix('api', {
      exclude: []
    })
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1'
    })
    app.enableCors({
      exposedHeaders: ['Content-Disposition']
    })

    SwaggerModule.addDocumentation(app)

    return app
  }
}

const _api = new Api()
