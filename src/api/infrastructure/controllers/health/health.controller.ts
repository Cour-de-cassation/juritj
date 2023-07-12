import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { BucketHealthIndicator } from './bucketHealthIndicator'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private bucket: BucketHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.bucket.isHealthy()])
  }
}
