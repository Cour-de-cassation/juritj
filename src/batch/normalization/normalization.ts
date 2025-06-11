import { v4 as uuidv4 } from 'uuid'
import { generateUniqueId } from './services/generateUniqueId'
import { removeOrReplaceUnnecessaryCharacters, isEmptyText, hasNoBreak } from './services/removeOrReplaceUnnecessaryCharacters'
import { ConvertedDecisionWithMetadonneesDto } from '../../shared/infrastructure/dto/convertedDecisionWithMetadonnees.dto'
import { logger } from './index'
import { fetchDecisionListFromS3 } from './services/fetchDecisionListFromS3'
import { DecisionS3Repository } from '../../shared/infrastructure/repositories/decisionS3.repository'
import { mapDecisionNormaliseeToDecisionDto } from './infrastructure/decision.dto'
import { transformDecisionIntegreFromWPDToText } from './services/transformDecisionIntegreContent'
import { CollectDto } from '../../shared/infrastructure/dto/collect.dto'
import { computeLabelStatus } from './services/computeLabelStatus'
import { DbSderApiGateway } from './repositories/gateways/dbsderApi.gateway'
import { normalizationFormatLogs } from './index'
import { computeOccultation } from './services/computeOccultation'

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

        // Step 1: Fetch decision from S3
        const decision: CollectDto = await s3Repository.getDecisionByFilename(decisionFilename)

        // Step 2: Cloning decision to save it in normalized bucket
        const decisionFromS3Clone = JSON.parse(JSON.stringify(decision))

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Starting normalization of ' + decisionFilename
        })

        // Step 3: Generating unique id for decision
        const _id = generateUniqueId(decision.metadonnees)
        normalizationFormatLogs.data = { decisionId: _id }
        logger.info({ ...normalizationFormatLogs, msg: 'Generated unique id for decision' })

        // Step 4: Transforming decision from WPD to text
        const decisionContent = await transformDecisionIntegreFromWPDToText(
          decision.decisionIntegre
        )

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Decision conversion finished. Removing unnecessary characters'
        })

        // Step 5: Removing or replace (by other thing) unnecessary characters from decision
        const cleanedDecision = removeOrReplaceUnnecessaryCharacters(decisionContent)

        if (!cleanedDecision || isEmptyText(cleanedDecision) || hasNoBreak(cleanedDecision)) {
          throw new Error('Empty text');
        }

        // Step 6: Map decision to DBSDER API Type to save it in database
        const decisionToSave = mapDecisionNormaliseeToDecisionDto(
          _id,
          cleanedDecision,
          decision.metadonnees,
          decisionFilename
        )
        decisionToSave.labelStatus = computeLabelStatus(decisionToSave)
        decisionToSave.occultation = computeOccultation(
          decision.metadonnees.recommandationOccultation,
          decision.metadonnees.occultationComplementaire,
          decision.metadonnees.debatPublic
        )

        // Step 7: Save decision in database
        await dbSderApiGateway.saveDecision(decisionToSave)
        logger.info({ ...normalizationFormatLogs, msg: 'Decision saved in database' })

        // Step 8: Save decision in normalized bucket
        await s3Repository.saveDecisionNormalisee(
          JSON.stringify(decisionFromS3Clone),
          decisionFilename
        )

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Decision saved in normalized bucket. Deleting decision in raw bucket'
        })

        // Step 9: Delete decision in raw bucket
        await s3Repository.deleteDecision(decisionFilename, bucketNameIntegre)

        logger.info({
          ...normalizationFormatLogs,
          msg: 'Successful normalization of ' + decisionFilename
        })
        listConvertedDecision.push({
          metadonnees: decisionToSave,
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
