import { ServiceUnavailableException } from '@nestjs/common'
import { CustomLogger } from '../../../shared/infrastructure/utils/customLogger.utils'
import { MetadonneesDto } from '../../../shared/infrastructure/dto/metadonnees.dto'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

export async function extractMetadonneesFromS3(filename: string): Promise<MetadonneesDto> {
  const s3Repository = new DecisionS3Repository()
  const logger = new CustomLogger()

  try {
    const decisionFromS3 = await s3Repository.getDecisionByFilename(filename)
    return decisionFromS3.metadonnees
  } catch (error) {
    logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
