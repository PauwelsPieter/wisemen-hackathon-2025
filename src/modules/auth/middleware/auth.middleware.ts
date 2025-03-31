import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { ConfigService } from '@nestjs/config'
import { UnauthorizedError } from '../../exceptions/generic/unauthorized.error.js'
import { UserAuthService } from '../../../app/users/services/user-auth.service.js'
import { AuthContent, AuthContext } from '../auth.context.js'

export interface TokenContent {
  sub: string
  email: string
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>

  constructor (
    private readonly configService: ConfigService,
    private readonly authContext: AuthContext,
    private readonly userAuthService: UserAuthService
  ) {
    this.jwks = createRemoteJWKSet(
      new URL(this.configService.getOrThrow('AUTH_JWKS_ENDPOINT'))
    )
  }

  public async use (req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.headers.authorization == null) {
      next()

      return
    }

    if (!req.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError()
    }

    const token = req.headers.authorization.split(' ')[1]

    try {
      const content = await this.verify(token)

      this.authContext.run(content, next)
    } catch (_error) {
      next()
    }
  }

  public async verify (token: string): Promise<AuthContent> {
    const { payload } = await jwtVerify<TokenContent>(token, this.jwks, {
      issuer: this.configService.getOrThrow('AUTH_ISSUER'),
      audience: this.configService.getOrThrow('AUTH_PROJECT_ID')
    })

    return await this.userAuthService.findOneByUserId(payload)
  }
}
