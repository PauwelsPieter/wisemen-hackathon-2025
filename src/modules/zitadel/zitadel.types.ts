import { Client } from '@connectrpc/connect'
import { FeatureService } from '@zitadel/proto/zitadel/feature/v2/feature_service_pb.js'
import { IdentityProviderService } from '@zitadel/proto/zitadel/idp/v2/idp_service_pb.js'
import { OIDCService } from '@zitadel/proto/zitadel/oidc/v2/oidc_service_pb.js'
import { OrganizationService } from '@zitadel/proto/zitadel/org/v2/org_service_pb.js'
import { SAMLService } from '@zitadel/proto/zitadel/saml/v2/saml_service_pb.js'
import { SessionService } from '@zitadel/proto/zitadel/session/v2/session_service_pb.js'
import { SettingsService } from '@zitadel/proto/zitadel/settings/v2/settings_service_pb.js'
import { UserService } from '@zitadel/proto/zitadel/user/v2/user_service_pb.js'

export type ZitadelFeatureClient = Client<typeof FeatureService>
export type ZitadelIdentityProviderClient = Client<typeof IdentityProviderService>
export type ZitadelSAMLClient = Client<typeof SAMLService>
export type ZitadelOIDCClient = Client<typeof OIDCService>
export type ZitadelSessionClient = Client<typeof SessionService>
export type ZitadelUserClient = Client<typeof UserService>
export type ZitadelOrganizationClient = Client<typeof OrganizationService>
export type ZitadelSettingsClient = Client<typeof SettingsService>
