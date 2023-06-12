import { Injectable, Logger } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus'
import { DecisionS3Repository } from '../../../../shared/infrastructure/repositories/decisionS3.repository'

@Injectable()
export class BucketHealthIndicator extends HealthIndicator {
  private key = 'bucket'
  private readonly logger = new Logger()

  constructor() {
    super()
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const decisionS3Repository = new DecisionS3Repository(this.logger)
    try {
      await decisionS3Repository.getDecisionList()
      return this.getStatus(this.key, true)
    } catch (error) {
      throw new HealthCheckError('Bucket call failed', this.getStatus(this.key, false))
    }
  }
}
