import { ServiceUnavailableException } from '@nestjs/common'
import { CollectDto } from '../../../shared/infrastructure/dto/collect.dto'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { logger } from '../normalization'

export async function saveNormalizedDecisionToS3(decision: CollectDto, filename: string) {
  const s3Repository = new DecisionS3Repository()
  try {
    await s3Repository.saveNormalizedDecision(JSON.stringify(decision), filename)
  } catch (error) {
    logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
