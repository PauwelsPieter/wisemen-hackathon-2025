import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import {
  createOrganizationServiceClient,
  createUserServiceClient,
  createSettingsServiceClient,
  createFeatureServiceClient,
  createIdpServiceClient,
  createSAMLServiceClient,
  createOIDCServiceClient,
  createSessionServiceClient
} from '@zitadel/client/v2'
import { createGrpcTransport } from '@connectrpc/connect-node'
import { Transport } from '@connectrpc/connect'
import {
  ZitadelFeatureClient,
  ZitadelIdentityProviderClient,
  ZitadelOIDCClient,
  ZitadelOrganizationClient,
  ZitadelSAMLClient,
  ZitadelSessionClient,
  ZitadelSettingsClient,
  ZitadelUserClient
} from './zitadel.types.js'
import { ZitadelUnavailableError } from './errors/zitadel-unavailable.error.js'
import { createZitadelErrorInterceptor } from './interceptors/zitadel-error.interceptor.js'
import { createZitadelTokenInterceptor } from './interceptors/zitadel-token.interceptor.js'

@Injectable()
export class ZitadelClient {
  private _userClient?: ZitadelUserClient
  private _organizationClient?: ZitadelOrganizationClient
  private _settingsClient?: ZitadelSettingsClient
  private _featureClient?: ZitadelFeatureClient
  private _identityProviderClient?: ZitadelIdentityProviderClient
  private _samlClient?: ZitadelSAMLClient
  private _oidcClient?: ZitadelOIDCClient
  private _sessionClient?: ZitadelSessionClient

  constructor (
    private readonly configService: ConfigService
  ) {
    try {
      const baseUrl = this.configService.getOrThrow<string>('ZITADEL_BASE_URL')
      const token = this.configService.getOrThrow<string>('ZITADEL_API_TOKEN')

      const tokenInterceptor = createZitadelTokenInterceptor(token)
      const errorInterceptor = createZitadelErrorInterceptor()

      const transport = createGrpcTransport({
        baseUrl: baseUrl,
        interceptors: [errorInterceptor, tokenInterceptor]
      })

      this.initializeClients(transport)
    } catch (error) {
      captureException(error)
    }
  }

  private initializeClients (transport: Transport): void {
    this._userClient = createUserServiceClient(transport)
    this._organizationClient = createOrganizationServiceClient(transport)
    this._settingsClient = createSettingsServiceClient(transport)
    this._featureClient = createFeatureServiceClient(transport)
    this._identityProviderClient = createIdpServiceClient(transport)
    this._samlClient = createSAMLServiceClient(transport)
    this._oidcClient = createOIDCServiceClient(transport)
    this._sessionClient = createSessionServiceClient(transport)
  }

  public get userClient (): ZitadelUserClient {
    if (!this._userClient) {
      throw new ZitadelUnavailableError('Zitadel user client is not available')
    } else {
      return this._userClient
    }
  }

  public get organizationClient (): ZitadelOrganizationClient {
    if (!this._organizationClient) {
      throw new ZitadelUnavailableError('Zitadel organization client is not available')
    } else {
      return this._organizationClient
    }
  }

  public get settingsClient (): ZitadelSettingsClient {
    if (!this._settingsClient) {
      throw new ZitadelUnavailableError('Zitadel settings client is not available')
    } else {
      return this._settingsClient
    }
  }

  public get featureClient (): ZitadelFeatureClient {
    if (!this._featureClient) {
      throw new ZitadelUnavailableError('Zitadel feature client is not available')
    } else {
      return this._featureClient
    }
  }

  public get identityProviderClient (): ZitadelIdentityProviderClient {
    if (!this._identityProviderClient) {
      throw new ZitadelUnavailableError('Zitadel identity provider client is not available')
    } else {
      return this._identityProviderClient
    }
  }

  public get samlClient (): ZitadelSAMLClient {
    if (!this._samlClient) {
      throw new ZitadelUnavailableError('Zitadel SAML client is not available')
    } else {
      return this._samlClient
    }
  }

  public get oidcClient (): ZitadelOIDCClient {
    if (!this._oidcClient) {
      throw new ZitadelUnavailableError('Zitadel OIDC client is not available')
    } else {
      return this._oidcClient
    }
  }

  public get sessionClient (): ZitadelSessionClient {
    if (!this._sessionClient) {
      throw new ZitadelUnavailableError('Zitadel session client is not available')
    } else {
      return this._sessionClient
    }
  }

  public get defaultOrganizationId (): string {
    const orgId = this.configService.get<string>('ZITADEL_ORGANISATION_ID')

    if (orgId === undefined) {
      throw new ZitadelUnavailableError('Zitadel default organization id is not configured')
    } else {
      return orgId
    }
  }
}
