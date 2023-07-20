import { v4 as uuidv4 } from 'uuid'
import { MetadonneesNormalisee } from '../../shared/domain/metadonnees'
import { generateUniqueId } from './services/generateUniqueId'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { normalizationContext, logger } from './index'
import { fetchDecisionListFromS3 } from './services/fetchDecisionListFromS3'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'
import { DecisionModel } from '../../shared/infrastructure/repositories/decisionModel.schema'
import { mapDecisionNormaliseeToLabelDecision } from './infrastructure/decision.label.dto'
import { transformDecisionIntegreFromWPDToText } from './services/transformDecisionIntegreContent'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'
import { updateLabelStatusIfDateDecisionIsInFuture } from './services/changeLabelStatus'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { LabelStatus } from 'dbsder-api-types'

const dbSderApiGateway = new DbSderApiGateway()
const bucketNameIntegre = process.env.S3_BUCKET_NAME_RAW

export async function normalizationJob(): Promise<ConvertedDecisionWithMetadonneesDto[]> {
  const listConvertedDecision: ConvertedDecisionWithMetadonneesDto[] = []
  const s3Repository = new DecisionS3Repository(logger)

  normalizationContext.start()
  normalizationContext.setCorrelationId(uuidv4())

  let decisionList = await fetchDecisionListFromS3(s3Repository)
  while (decisionList.length > 0) {
    for (const decisionFilename of decisionList) {
      try {
        const decision: CollectDto = await s3Repository.getDecisionByFilename(decisionFilename)

        const metadonnees = decision.metadonnees

        logger.log('Normalization job starting for decision ' + decisionFilename)

        const idDecision = generateUniqueId(metadonnees)
        logger.log('Decision ID generated. Starting Wpd to text conversion ', idDecision)

        const decisionContent = await transformDecisionIntegreFromWPDToText(
          decision.decisionIntegre
        )
        logger.log('Decision conversion finished. Removing unnecessary characters', idDecision)

        const cleanedDecision = removeUnnecessaryCharacters(decisionContent)

        const transformedMetadonnees: MetadonneesNormalisee = {
          idDecision: idDecision,
          labelStatus: LabelStatus.TOBETREATED,
          ...metadonnees
        }

        const transformedDecision: DecisionModel = {
          decision: cleanedDecision,
          metadonnees: transformedMetadonnees
        }

        const decisionToSave = mapDecisionNormaliseeToLabelDecision(
          transformedDecision,
          decisionFilename
        )

        const decisionToSaveDateChecked = updateLabelStatusIfDateDecisionIsInFuture(decisionToSave)

        await dbSderApiGateway.saveDecision(decisionToSaveDateChecked)
        logger.log('Decision saved in database.', idDecision)

        decision.metadonnees = transformedMetadonnees
        await s3Repository.saveDecisionNormalisee(JSON.stringify(decision), decisionFilename)
        logger.log(
          'Decision saved in normalized bucket. Deleting decision in raw bucket',
          idDecision
        )

        await s3Repository.deleteDecision(decisionFilename, bucketNameIntegre)

        logger.log('Successful normalization of ' + decisionFilename, idDecision)
        listConvertedDecision.push({
          metadonnees: transformedMetadonnees,
          decisionNormalisee: cleanedDecision
        })
      } catch (error) {
        logger.error(error)
        logger.error('Failed to normalize the decision ' + decisionFilename + '.')
        continue
      }
    }
    const lastTreatedDecisionFileName = decisionList[decisionList.length - 1]
    decisionList = await fetchDecisionListFromS3(s3Repository, lastTreatedDecisionFileName)
  }

  if (listConvertedDecision.length == 0) {
    logger.log('No decisions found, will try again later.')
    return []
  }

  return listConvertedDecision
}
