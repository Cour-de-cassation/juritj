import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

const NUMBER_OF_DECISION_TO_RETURN = 10
export async function fetchDecisionListFromS3() {
  const repository = new DecisionS3Repository()
  try {
    const rawDecisionList = await repository.getDecisionList()
    const numberOfDecisionToFetch =
      rawDecisionList.length >= NUMBER_OF_DECISION_TO_RETURN
        ? NUMBER_OF_DECISION_TO_RETURN
        : rawDecisionList.length
    return rawDecisionList.splice(0, numberOfDecisionToFetch).map((decision) => decision.Key)
  } catch (error) {
    throw new ServiceUnavailableException('Error from S3 API')
  }
}
