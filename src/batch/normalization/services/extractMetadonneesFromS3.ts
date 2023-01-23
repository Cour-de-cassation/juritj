import { ServiceUnavailableException } from '@nestjs/common'
import { MetadonneesDto } from '../../../shared/infrastructure/dto/metadonnees.dto'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { logger } from '../normalization'

export async function extractMetadonneesFromS3(filename: string): Promise<MetadonneesDto> {
  const s3Repository = new DecisionS3Repository()

  try {
    const decisionFromS3 = await s3Repository.getDecisionByFilename(filename)
    return decisionFromS3.metadonnees
  } catch (error) {
    logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
