import { CronJob } from 'cron'
import { Context } from '../../shared/infrastructure/utils/context'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { normalizationJob } from './normalization'

const EXIT_ERROR_CODE = 1
const CRON_EVERY_HOUR = '0 * * * *'

export const normalizationContext = new Context()
export const logger = new CustomLogger(normalizationContext, 'Normalization')

async function startNormalization() {
  try {
    await normalizationJob()
  } catch (error) {
    logger.error(error)
    logger.log('Leaving due to an error...')
    process.exit(EXIT_ERROR_CODE)
  }
}

function startJob() {
  startNormalization().then(() => {
    const cron = new CronJob({
      cronTime: CRON_EVERY_HOUR,
      onTick() {
        logger.log('Starting normalization...')
        startNormalization()
      },
      timeZone: 'Europe/Paris'
    })
    cron.start()
  })
}

startJob()
