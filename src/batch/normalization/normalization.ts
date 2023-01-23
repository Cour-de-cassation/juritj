import { Metadonnees } from '../../shared/domain/metadonnees'
import { saveMetadonnees } from './services/saveToMongo'
import { generateUniqueId } from './services/generateUniqueId'
import { normalizeDatesToIso8601 } from './services/convertDates'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { extractMetadonneesFromS3 } from './services/extractMetadonneesFromS3'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { MetadonneesDto } from 'src/shared/infrastructure/dto/metadonnees.dto'

const decisionName = '2023-01-06T13:57:13.288Zole6.wpd'
const decisionContent = new MockUtils().decisionContent

export async function normalizationJob(
  decisionName: string,
  decisionContent: string
): Promise<ConvertedDecisionWithMetadonneesDto> {
  const logger = new CustomLogger()
  try {
    const metadonnees: MetadonneesDto = await extractMetadonneesFromS3(decisionName)

    logger.log(
      '[NORMALIZATION JOB] Normalization job starting for decision ' +
        decisionName +
        ' with metadata: ' +
        JSON.stringify(metadonnees) +
        ' and decision: ' +
        decisionContent
    )

    const idDecision = generateUniqueId(metadonnees)
    logger.log('[NORMALIZATION JOB] Decision ID generated', idDecision)

    const cleanedDecision = removeUnnecessaryCharacters(decisionContent)
    logger.log('[NORMALIZATION JOB] Unnecessary characters removed from decision.', idDecision)

    const convertedDecision = normalizeDatesToIso8601(cleanedDecision)
    logger.log('[NORMALIZATION JOB] Decision dates converted to ISO8601.', idDecision)

    const transformedMetadonnees: Metadonnees = metadonnees
    transformedMetadonnees.idDecision = idDecision
    await saveMetadonnees(transformedMetadonnees)

    logger.log('[NORMALIZATION JOB] Metadonnees saved in database.', idDecision)

    logger.log(
      '[NORMALIZATION JOB] End of normalization job for decision ' +
        decisionName +
        ' with metadata: ' +
        JSON.stringify(transformedMetadonnees) +
        ' and decision: ' +
        convertedDecision
    )
    return {
      metadonnees: transformedMetadonnees,
      decisionNormalisee: convertedDecision
    }
  } catch (error) {
    logger.error(error)
    process.exit(1)
  } finally {
    process.exit()
  }
}

normalizationJob(decisionName, decisionContent)
