import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientCertStrategy } from './client-cert.strategy'

@Module({
  imports: [ConfigModule],
  providers: [ClientCertStrategy],
  exports: [ClientCertStrategy]
})
export class AuthModule {}
