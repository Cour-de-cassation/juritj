import { ServiceUnavailableException } from '@nestjs/common'
import { MetadonneesDto } from 'src/shared/infrastructure/dto/metadonnees.dto'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

const s3Repository = new DecisionS3Repository()

export async function getDecisionMetadonneesFromS3File(filename: string): Promise<MetadonneesDto> {
  try {
    const decisionFromS3 = await s3Repository.getDecisionByFilename(filename)
    return decisionFromS3.metadonnees
  } catch (error) {
    this.logger.error(error + error.stack)
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
