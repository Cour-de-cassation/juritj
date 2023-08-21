import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'
import { InfrastructureExpection } from '../../../shared/infrastructure/exceptions/infrastructure.exception'
import { logger, normalizationFormatLogs } from '..'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'
import { HttpStatus } from '@nestjs/common'

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
    const formatLogs: LogsFormat = {
      ...normalizationFormatLogs,
      operationName: 'fetchDecisionListFromS3',
      msg: error.message,
      statusCode: HttpStatus.SERVICE_UNAVAILABLE
    }
    logger.error(formatLogs)
    throw new InfrastructureExpection(error.message)
  }
}
