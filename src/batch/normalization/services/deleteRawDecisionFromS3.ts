import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { logger } from '../normalization'

export async function deleteRawDecisionFromS3(filename: string) {
  const s3Repository = new DecisionS3Repository()
  const bucketName = process.env.SCW_BUCKET_NAME_RAW
  try {
    await s3Repository.deleteDecision(filename, bucketName)
  } catch (error) {
    logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
