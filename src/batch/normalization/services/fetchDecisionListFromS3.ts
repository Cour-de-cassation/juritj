import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { InfrastructureExpection } from '../../../shared/infrastructure/exceptions/infrastructure.exception'
import { logger } from '..'

const MAX_NUMBER_OF_DECISIONS_TO_RETRIEVE = 2

export async function fetchDecisionListFromS3(
  repository: DecisionS3Repository,
  filename?: string
): Promise<string[]> {
  try {
    const rawDecisionList = await repository.getDecisionList(
      MAX_NUMBER_OF_DECISIONS_TO_RETRIEVE,
      filename
    )
    return rawDecisionList.splice(0, rawDecisionList.length).map((decision) => decision.Key)
  } catch (error) {
    logger.error(error.message)
    throw new InfrastructureExpection(error.message)
  }
}
