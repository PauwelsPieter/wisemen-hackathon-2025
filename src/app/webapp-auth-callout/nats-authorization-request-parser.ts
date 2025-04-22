import { Injectable } from '@nestjs/common'
import { ServiceMsg } from '@nats-io/services'
import { decode } from '@nats-io/jwt'
import { ParsedAuthorizationRequest } from './parsed-nats-authorization-request.type.js'
import { NatsAuthorizationRequest } from './nats-authorization-request.type.js'

@Injectable()
export class NatsAuthorizationRequestParser {
  parse (msg: ServiceMsg): ParsedAuthorizationRequest {
    const authorizationRequest = new TextDecoder('utf-8').decode(msg.data)
    const requestClaim = decode<NatsAuthorizationRequest>(authorizationRequest)

    if (requestClaim.nats.user_nkey === undefined) {
      throw new Error('Missing user nkey')
    }

    if (requestClaim.nats.server_id?.name === undefined) {
      throw new Error('Missing server id name')
    }

    if (requestClaim.nats.connect_opts?.auth_token === undefined) {
      throw new Error('Missing auth token')
    }

    return {
      userNkey: requestClaim.nats.user_nkey,
      serverNkey: requestClaim.nats.server_id.name,
      authToken: requestClaim.nats.connect_opts.auth_token,
      clientName: requestClaim.nats.client_info?.name ?? 'unknown'
    }
  }
}
