import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus'
import { DecisionS3Repository } from '../../../../shared/infrastructure/repositories/decisionS3.repository'
import { logger } from '../../../../shared/infrastructure/utils/pinoConfig.utils'

@Injectable()
export class BucketHealthIndicator extends HealthIndicator {
  private key = 'bucket'

  constructor() {
    super()
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const decisionS3Repository = new DecisionS3Repository(logger)
    try {
      await decisionS3Repository.getDecisionList()
      return this.getStatus(this.key, true)
    } catch (error) {
      throw new HealthCheckError('Bucket call failed', this.getStatus(this.key, false))
    }
  }
}
