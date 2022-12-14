import { generateUniqueId } from './services/generateUniqueId'
import { normalizeDatesToIso8601 } from './services/convertDates'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { MetadonneesDto } from '../../shared/infrastructure/dto/metadonnees.dto'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { CustomLogger } from '../../shared/infrastructure/utils/log.utils'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'

const fakeMetadonnees = new MockUtils().metadonneesDtoMock
const fakeDecisionContent = ''
const logger = new CustomLogger()

export function normalizationJob(
  metadonnees: MetadonneesDto,
  decisionContent: string
): ConvertedDecisionWithMetadonneesDto {
  logger.log(
    '[NORMALIZATION JOB] Normalization job starting with: ' +
      JSON.stringify(metadonnees) +
      ' and decision: ' +
      decisionContent
  )

  const idDecision = generateUniqueId(metadonnees)
  logger.log('[NORMALIZATION JOB] Decision ID generated : ' + idDecision)

  const cleanedDecision = removeUnnecessaryCharacters(decisionContent)
  logger.log('[NORMALIZATION JOB] Unnecessary characters removed from decision.')

  const convertedDecision = normalizeDatesToIso8601(cleanedDecision)
  logger.log('[NORMALIZATION JOB] Decision dates converted to ISO8601.')

  logger.log(
    '[NORMALIZATION JOB] End of normalization job with: ' +
      JSON.stringify({ ...metadonnees, idDecision }) +
      ' and decision: ' +
      convertedDecision
  )
  return {
    metadonnees: { ...metadonnees, idDecision },
    decisionNormalisee: convertedDecision
  }
}

normalizationJob(fakeMetadonnees, fakeDecisionContent)
