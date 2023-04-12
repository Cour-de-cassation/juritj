import { PeerCertificate, Strategy } from 'passport-client-cert'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class ClientCertStrategy extends PassportStrategy(Strategy) {
  private whitelistedCns: string[] = []

  constructor() {
    super()
    // TO DO : Refacto du CC dans le ||
    this.whitelistedCns.push(process.env.WHITELIST_CN || 'CC')
  }

  async validate(clientCert: PeerCertificate): Promise<any> {
    const cn = clientCert && clientCert.subject && clientCert.subject.CN
    if (!this.whitelistedCns.includes(cn)) {
      console.error('Unauthorized: Client cert cn : %s is not whitelisted', cn)
      throw new UnauthorizedException()
    }
    console.log(cn, 'Client Authorized')
    return Promise.resolve({ user: { name: cn } })
  }
}
