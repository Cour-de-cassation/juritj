import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

const MAX_NUMBER_OF_DECISIONS_TO_RETRIEVE = 2

export async function fetchDecisionListFromS3(repository: DecisionS3Repository, key?: string): Promise<string[]> {
  try {
    const rawDecisionList = await repository.getDecisionList(MAX_NUMBER_OF_DECISIONS_TO_RETRIEVE, key)
    return rawDecisionList.splice(0, rawDecisionList.length).map((decision) => decision.Key)
  } catch (error) {
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
