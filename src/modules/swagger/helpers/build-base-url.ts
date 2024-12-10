import { EnvType } from '../../../utils/envs/env.enum.js'

export function buildBaseUrl (
  env: EnvType
): string {
  if (env === EnvType.LOCAL) {
    return 'http://localhost:3000'
  } else {
    const domain = process.env.SWAGGER_DOMAIN ?? 'example'

    return `https://${domain}.${env}.appwi.se`
  }
}
