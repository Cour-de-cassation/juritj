import { PinoLogger } from 'nestjs-pino'
import { normalizationPinoConfig } from '../shared/infrastructure/utils/pinoConfig.utils'
import { CollectDto } from '../shared/infrastructure/dto/collect.dto'
import { DecisionS3Repository } from '../shared/infrastructure/repositories/decisionS3.repository'

const logger = new PinoLogger(normalizationPinoConfig)

async function main(key: string) {
  const s3Repository = new DecisionS3Repository(logger)
  const t0 = new Date()
  const decision: CollectDto = await s3Repository.getNormalizedDecisionByFilename(key)
  const t1 = new Date()
  logger.info(`Got idDecision ${decision.metadonnees.idDecision} for file ${key}`)
  logger.info(`Took ${((t1.getTime() - t0.getTime()) / 1000).toFixed(2)} seconds`)
}

main(process.argv[2])
