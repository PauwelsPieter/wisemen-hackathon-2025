import Joi from 'joi'
import { EnvType } from './env.enum.js'

const validSslTypes = ['false', 'true', 'ignore']

export const envValidationSchema = Joi.object({
  TZ: Joi.string().valid('UTC').required(),
  NODE_ENV: Joi.string().valid(...Object.values(EnvType)).required(),

  DATABASE_URI: Joi.string().uri().required(),
  DATABASE_SSL: Joi.string().valid(...validSslTypes).required(),

  FRONTEND_URL: Joi.string().uri().required(),

  AUTH_JWKS_ENDPOINT: Joi.string().uri().required(),
  AUTH_ISSUER: Joi.string().uri().required(),
  AUTH_PROJECT_ID: Joi.string().required()
})
