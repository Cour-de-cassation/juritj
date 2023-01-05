import { generateUniqueId } from './services/generateUniqueId'
import { normalizeDatesToIso8601 } from './services/convertDates'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { saveMetadonnees } from './services/saveToMongo'
import { getDecisionMetadonneesFromS3File } from './services/getDecisionFromS3'
import { Metadonnees } from '../../shared/domain/metadonnees'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'

const logger = new CustomLogger()
const decisionName = '2023-01-06T13:57:13.288Zole6.wpd'
const decisionContent = new MockUtils().decisionContent

export function normalizationJob(
  decisionName: string,
  decisionContent: string
): Promise<ConvertedDecisionWithMetadonneesDto> {
  // decisionContent mis en dur temporairement, car on ne sait pas lire le .wpd actuellement

  const res = getDecisionMetadonneesFromS3File(decisionName).then(
    (metadonnees: Metadonnees): ConvertedDecisionWithMetadonneesDto => {
      logger.log(
        '[NORMALIZATION JOB] Normalization job starting for decision ' +
          decisionName +
          ' with metadata: ' +
          JSON.stringify(metadonnees) +
          ' and decision: ' +
          decisionContent
      )

      const idDecision = generateUniqueId(metadonnees)
      logger.log('[NORMALIZATION JOB] Decision ID generated : ' + idDecision)
      const cleanedDecision = removeUnnecessaryCharacters(decisionContent)
      logger.log('[NORMALIZATION JOB] Unnecessary characters removed from decision.')
      const idDecision = generateUniqueId(metadonnees)
      logger.log('[NORMALIZATION JOB] Decision ID generated', idDecision)

      const cleanedDecision = removeUnnecessaryCharacters(decisionContent)
      logger.log('[NORMALIZATION JOB] Unnecessary characters removed from decision.', idDecision)

      const convertedDecision = normalizeDatesToIso8601(cleanedDecision)
      logger.log('[NORMALIZATION JOB] Decision dates converted to ISO8601.', idDecision)

      logger.log(
        '[NORMALIZATION JOB] End of normalization job for decision ' +
          decisionName +
          ' with metadata: ' +
          JSON.stringify({ ...metadonnees, idDecision }) +
          ' and decision: ' +
          convertedDecision
      )
      metadonnees.idDecision = idDecision

      saveMetadonnees(metadonnees)
      return {
        metadonnees: { ...metadonnees, idDecision },
        decisionNormalisee: convertedDecision
      }
    }
  )
  return res.then((convertedDecision) => convertedDecision)
}

normalizationJob(decisionName, decisionContent)
