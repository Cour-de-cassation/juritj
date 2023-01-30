import { ServiceUnavailableException } from '@nestjs/common'
import { CollectDto } from '../../../shared/infrastructure/dto/collect.dto'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { logger } from '../normalization'

// TO DO : Renommer le fichier en getDecisionFromS3
export async function getDecisionFromS3(filename: string): Promise<CollectDto> {
  const s3Repository = new DecisionS3Repository()

  try {
    return await s3Repository.getDecisionByFilename(filename)
  } catch (error) {
    logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
