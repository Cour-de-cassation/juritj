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
import { computeLabelStatus } from './services/computeLabelStatus'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { LabelStatus } from 'dbsder-api-types'
import { LogsFormat } from '../../shared/infrastructure/utils/logsFormat.utils'

const dbSderApiGateway = new DbSderApiGateway()
const bucketNameIntegre = process.env.S3_BUCKET_NAME_RAW

export async function normalizationJob(): Promise<ConvertedDecisionWithMetadonneesDto[]> {
  const listConvertedDecision: ConvertedDecisionWithMetadonneesDto[] = []
  const s3Repository = new DecisionS3Repository(logger)

  normalizationContext.start()
  normalizationContext.setCorrelationId(uuidv4())

  let decisionList = await fetchDecisionListFromS3(s3Repository)
  const formatLogs: LogsFormat = {
    operationName: 'normalizationJob',
    msg: 'Starting normalization job...',
    correlationId: normalizationContext.getCorrelationId()
  }

  while (decisionList.length > 0) {
    for (const decisionFilename of decisionList) {
      try {
        const decision: CollectDto = await s3Repository.getDecisionByFilename(decisionFilename)

        const metadonnees = decision.metadonnees
        logger.info({ ...formatLogs, msg: 'Starting normalization of ' + decisionFilename })

        const _id = generateUniqueId(metadonnees)
        logger.info({ ...formatLogs, msg: 'Generated unique id for decision', decisionId: _id })

        const decisionContent = await transformDecisionIntegreFromWPDToText(
          decision.decisionIntegre
        )

        logger.info({
          ...formatLogs,
          msg: 'Decision conversion finished. Removing unnecessary characters',
          decisionId: _id
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
        logger.info({ ...formatLogs, msg: 'Decision saved in database', decisionId: _id })

        decision.metadonnees = transformedMetadonnees
        await s3Repository.saveDecisionNormalisee(JSON.stringify(decision), decisionFilename)

        logger.info({
          ...formatLogs,
          msg: 'Decision saved in normalized bucket. Deleting decision in raw bucket',
          decisionId: _id
        })

        await s3Repository.deleteDecision(decisionFilename, bucketNameIntegre)

        logger.info({
          ...formatLogs,
          msg: 'Successful normalization of' + decisionFilename,
          decisionId: _id
        })
        listConvertedDecision.push({
          metadonnees: transformedMetadonnees,
          decisionNormalisee: cleanedDecision
        })
      } catch (error) {
        logger.error({
          ...formatLogs,
          msg: error.message,
          data: error
        })
        logger.error({
          ...formatLogs,
          msg: 'Failed to normalize the decision ' + decisionFilename + '.'
        })
        continue
      }
    }
    const lastTreatedDecisionFileName = decisionList[decisionList.length - 1]
    decisionList = await fetchDecisionListFromS3(s3Repository, lastTreatedDecisionFileName)
  }

  if (listConvertedDecision.length == 0) {
    logger.info({ ...formatLogs, msg: 'No decision to normalize.' })
    return []
  }

  return listConvertedDecision
}
