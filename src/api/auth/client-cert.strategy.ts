import { PeerCertificate, Strategy } from 'passport-client-cert'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { Context } from '../../shared/infrastructure/utils/context'

@Injectable()
export class ClientCertStrategy extends PassportStrategy(Strategy) {
  private normalizationContext = new Context()

  private logger = new CustomLogger(this.normalizationContext)
  private whitelistedCns: string[] = []

  constructor() {
    super()
    // TO DO : Refacto du CC dans le ||
    this.whitelistedCns.push(process.env.WHITELIST_CN || 'CC')
  }

  async validate(clientCert: PeerCertificate): Promise<any> {
    const cn = clientCert && clientCert.subject && clientCert.subject.CN
    if (!this.whitelistedCns.includes(cn)) {
      this.logger.error(`[AUTH] Unauthorized: Client cert cn: ${cn} is not whitelisted`)
      throw new UnauthorizedException()
    }
    this.logger.log(`[AUTH] Client Authorized: ${cn}`)
    return Promise.resolve({ user: { name: cn } })
  }
}
