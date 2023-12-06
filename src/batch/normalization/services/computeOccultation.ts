import { DecisionOccultation, Occultation } from 'dbsder-api-types'
import { logger, normalizationFormatLogs } from '../index'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'

export function computeOccultation(
  recommandationOccultation: string,
  occultationComplementaire: string
): DecisionOccultation {
  const formatLogs: LogsFormat = {
    ...normalizationFormatLogs,
    operationName: 'computeOccultation',
    msg: 'Starting computeOccultation...'
  }

  const additionalTerms =
    recommandationOccultation === Occultation.SUBSTITUANT ||
    recommandationOccultation === Occultation.COMPLEMENT
      ? occultationComplementaire
      : ''

  logger.info({
    ...formatLogs,
    msg: `additionalTerms computed: ${additionalTerms}`
  })

  return {
    additionalTerms,
    categoriesToOmit: []
  }
}
