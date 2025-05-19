import { UnIdentifiedDecisionTj, SuiviOccultation } from 'dbsder-api-types'
import { logger, normalizationFormatLogs } from '../index'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'

export function computeOccultation(
  recommandationOccultation: string,
  occultationSupplementaire: string,
  debatPublic: boolean
): UnIdentifiedDecisionTj['occultation'] {
  const formatLogs: LogsFormat = {
    ...normalizationFormatLogs,
    operationName: 'computeOccultation',
    msg: 'Starting computeOccultation...'
  }

  const additionalTerms =
    recommandationOccultation === SuiviOccultation.SUBSTITUANT ||
    recommandationOccultation === SuiviOccultation.COMPLEMENT
      ? occultationSupplementaire
      : ''

  logger.info({
    ...formatLogs,
    msg: `additionalTerms computed`
  })

  const motivationOccultation =
    recommandationOccultation === SuiviOccultation.AUCUNE ||
    recommandationOccultation === SuiviOccultation.SUBSTITUANT
      ? false
      : !debatPublic

  logger.info({
    ...formatLogs,
    msg: `motivationOccultation computed ${motivationOccultation}`
  })

  return {
    additionalTerms,
    categoriesToOmit: [],
    motivationOccultation
  }
}
