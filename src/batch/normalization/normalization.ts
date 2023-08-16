import { v4 as uuidv4 } from 'uuid'
import { MetadonneesNormalisee } from '../../shared/domain/metadonnees'
import { generateUniqueId } from './services/generateUniqueId'
import { removeUnnecessaryCharacters } from './services/removeUnnecessaryCharacters'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { logger } from './index'
import { fetchDecisionListFromS3 } from './services/fetchDecisionListFromS3'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'
import { DecisionModel } from '../../shared/infrastructure/repositories/decisionModel.schema'
import { mapDecisionNormaliseeToLabelDecision } from './infrastructure/decision.label.dto'
import { transformDecisionIntegreFromWPDToText } from './services/transformDecisionIntegreContent'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'
import { computeLabelStatus } from './services/computeLabelStatus'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { LabelStatus } from 'dbsder-api-types'
import { normalizationFormatLogs } from './index'

const dbSderApiGateway = new DbSderApiGateway()
const bucketNameIntegre = process.env.S3_BUCKET_NAME_RAW

export async function normalizationJob(): Promise<ConvertedDecisionWithMetadonneesDto[]> {
  const listConvertedDecision: ConvertedDecisionWithMetadonneesDto[] = []
  const s3Repository = new DecisionS3Repository(logger)

  let decisionList = await fetchDecisionListFromS3(s3Repository)

  while (decisionList.length > 0) {
    for (const decisionFilename of decisionList) {
      try {
        const jobId = uuidv4()
        normalizationFormatLogs.correlationId = jobId

        const decision: CollectDto = await s3Repository.getDecisionByFilename(decisionFilename)

        const metadonnees = decision.metadonnees
        logger.info({
          ...normalizationFormatLogs,
          msg: 'Starting normalization of ' + decisionFilename
        })

        const _id = generateUniqueId(metadonnees)
        normalizationFormatLogs.data = { decisionId: _id }
        logger.info({ ...normalizationFormatLogs, msg: 'Generated unique id for decision' })

        const decisionContent = await transformDecisionIntegreFromWPDToText(
          decision.decisionIntegre
        )

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Decision conversion finished. Removing unnecessary characters'
        })

        const cleanedDecision = removeUnnecessaryCharacters(decisionContent)

        const transformedMetadonnees: MetadonneesNormalisee = {
          _id,
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
        decisionToSave.labelStatus = computeLabelStatus(decisionToSave)

        await dbSderApiGateway.saveDecision(decisionToSave)
        logger.info({ ...normalizationFormatLogs, msg: 'Decision saved in database' })

        decision.metadonnees = transformedMetadonnees
        await s3Repository.saveDecisionNormalisee(JSON.stringify(decision), decisionFilename)

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Decision saved in normalized bucket. Deleting decision in raw bucket'
        })

        await s3Repository.deleteDecision(decisionFilename, bucketNameIntegre)

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Successful normalization of' + decisionFilename
        })
        listConvertedDecision.push({
          metadonnees: transformedMetadonnees,
          decisionNormalisee: cleanedDecision
        })
      } catch (error) {
        logger.error({
          ...normalizationFormatLogs,
          msg: error.message,
          data: error
        })
        logger.error({
          ...normalizationFormatLogs,
          msg: 'Failed to normalize the decision ' + decisionFilename + '.'
        })
        continue
      }
    }
    const lastTreatedDecisionFileName = decisionList[decisionList.length - 1]
    decisionList = await fetchDecisionListFromS3(s3Repository, lastTreatedDecisionFileName)
  }

  if (listConvertedDecision.length == 0) {
    logger.info({ ...normalizationFormatLogs, msg: 'No decision to normalize.' })
    return []
  }

  return listConvertedDecision
}
