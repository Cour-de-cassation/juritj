import { CronJob } from 'cron'
import { PinoLogger } from 'nestjs-pino'
import { normalizationJob } from './normalization'
import { LogsFormat } from '../../shared/infrastructure/utils/logsFormat.utils'
import { normalizationPinoConfig } from '../../shared/infrastructure/utils/pinoConfig.utils'

const EXIT_ERROR_CODE = 1

export const logger = new PinoLogger(normalizationPinoConfig)
// WARNING : using normalizationFormatLogs as a global variable to provide correlationId and decisionId in all services
// Replace operationName and msg when using it outside of normalizationJob
// correlationId and decisionId are provided for each normalized decision
export const normalizationFormatLogs: LogsFormat = {
  operationName: 'normalizationJob',
  msg: 'Starting normalization job...'
}

async function startNormalization() {
  try {
    await normalizationJob()
  } catch (error) {
    const formatLogs: LogsFormat = {
      operationName: 'startNormalization',
      msg: error.message,
      data: error
    }
    logger.error(formatLogs)
    logger.info({ ...formatLogs, msg: 'Leaving due to an error...' })
    process.exit(EXIT_ERROR_CODE)
  }
  return
}

function startJob() {
  startNormalization().then(() => {
    const cron = new CronJob({
      cronTime: process.env.NORMALIZATION_BATCH_SCHEDULE || '0 * * * *',
      onTick() {
        // Commenté car le batch ne se lance plus : le job n'est jamais considéré fini (running à false)
        // if (!this.running) {
        const formatLogs: LogsFormat = {
          operationName: 'startJob',
          msg: 'Starting normalization...'
        }
        logger.info(formatLogs)
        startNormalization()
        //    }
        //  logger.info('Normalization job already running...')
      },
      timeZone: 'Europe/Paris'
    })
    cron.start()
  })
}

startJob()
