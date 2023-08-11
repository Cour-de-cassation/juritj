import { CronJob } from 'cron'
import { PinoLogger } from 'nestjs-pino'
import { Context } from '../../shared/infrastructure/utils/context'
import { normalizationJob } from './normalization'
import { getPinoConfigNormalization } from '../../shared/infrastructure/utils/pinoConfig.utils'
import { LogsFormat } from '../../shared/infrastructure/utils/logsFormat.utils'

const EXIT_ERROR_CODE = 1
const CRON_EVERY_HOUR = '0 * * * *'

export const normalizationContext = new Context()
export const logger = new PinoLogger(getPinoConfigNormalization())

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
}

function startJob() {
  startNormalization().then(() => {
    const cron = new CronJob({
      cronTime: CRON_EVERY_HOUR,
      onTick() {
        const formatLogs: LogsFormat = {
          operationName: 'startJob',
          msg: 'Starting normalization...'
        }
        logger.info(formatLogs)
        startNormalization()
      },
      timeZone: 'Europe/Paris'
    })
    cron.start()
  })
}

startJob()
