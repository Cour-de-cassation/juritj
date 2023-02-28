import { v4 as uuidv4 } from 'uuid'
import { MetadonneesNormalisee } from '../../shared/domain/metadonnees'
import { generateUniqueId } from './services/generateUniqueId'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { normalizationContext, logger } from './index'
import { fetchDecisionListFromS3 } from './services/fetchDecisionListFromS3'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'
import { DecisionMongoRepository } from './repositories/decisionMongo.repository'
import { DecisionModel } from '../../shared/infrastructure/repositories/decisionModel.schema'
import { LabelStatus } from '../../shared/domain/enums'
import { mapDecisionNormaliseeToLabelDecision } from './domain/decision.label.dto'
import { transformDecisionIntegreFromWPDToText } from './services/transformDecisionIntegreContent'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'

const decisionMongoRepository = new DecisionMongoRepository()
const s3Repository = new DecisionS3Repository()
const bucketNameIntegre = process.env.S3_BUCKET_NAME_RAW

export async function normalizationJob(): Promise<ConvertedDecisionWithMetadonneesDto[]> {
  const listConvertedDecision: ConvertedDecisionWithMetadonneesDto[] = []

  normalizationContext.start()
  normalizationContext.setCorrelationId(uuidv4())
  const decisionList = await fetchDecisionListFromS3()
  if (decisionList.length > 0) {
    for (const decisionName of decisionList) {
      try {
        const decision: CollectDto = await s3Repository.getDecisionByFilename(decisionName)
        const metadonnees = decision.metadonnees

        logger.log('[NORMALIZATION JOB] Normalization job starting for decision ' + decisionName)

        const idDecision = generateUniqueId(metadonnees)
        logger.log('[NORMALIZATION JOB] Decision ID generated', idDecision)

        logger.log(
          '[NORMALIZATION JOB] Starting the decision conversion from WPD to text.',
          idDecision
        )

        const decisionContent = await transformDecisionIntegreFromWPDToText(
          decision.decisionIntegre
        )
        logger.log('[NORMALIZATION JOB] Decision conversion finished.', idDecision)

        const cleanedDecision = removeUnnecessaryCharacters(decisionContent)
        logger.log('[NORMALIZATION JOB] Unnecessary characters removed from decision.', idDecision)

        const transformedMetadonnees: MetadonneesNormalisee = {
          idDecision: idDecision,
          labelStatus: LabelStatus.TOBETREATED,
          ...metadonnees
        }

        const transformedDecision: DecisionModel = {
          decision: cleanedDecision,
          metadonnees: transformedMetadonnees
        }

      const savedInMongoDecision = await decisionMongoRepository.saveDecision(transformedDecision)
      logger.log('[NORMALIZATION JOB] Metadonnees saved in database.', idDecision)

      console.log(mapDecisionNormaliseeToLabelDecision(savedInMongoDecision))

        decision.metadonnees = transformedMetadonnees
        await s3Repository.saveDecisionNormalisee(JSON.stringify(decision), decisionName)
        logger.log('[NORMALIZATION JOB] Decision saved in normalized bucket.', idDecision)

        await s3Repository.deleteDecision(decisionName, bucketNameIntegre)
        logger.log('[NORMALIZATION JOB] Decision deleted in raw bucket.', idDecision)

        logger.log(
          '[NORMALIZATION JOB] End of normalization job for decision ' + decisionName,
          idDecision
        )
        listConvertedDecision.push({
          metadonnees: transformedMetadonnees,
          decisionNormalisee: cleanedDecision
        })
      } catch (error) {
        logger.error('[NORMALIZATION JOB] Failed to normalize the decision ' + decisionName + '.')
        continue
      }
    }

    return listConvertedDecision
  } else {
    logger.log('No decisions found to normalize... Exiting now')
    return []
  }
}
