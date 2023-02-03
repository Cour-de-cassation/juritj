import { CronJob } from 'cron'
import { Context } from '../../shared/infrastructure/utils/context'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { normalizationJob } from './normalization'

const decisionContent = new MockUtils().decisionContent
const EXIT_ERROR_CODE = 1
const CRON_EVERY_HOUR = '0 * * * *'

export const normalizationContext = new Context()
export const logger = new CustomLogger(normalizationContext)

async function startNormalization() {
  try {
    await normalizationJob(decisionContent)
  } catch (error) {
    logger.error(error)
    logger.log('[NORMALIZATION JOB] Leaving due to an error...')
    process.exit(EXIT_ERROR_CODE)
  }
}

function startJob() {
  startNormalization().then(() => {
    const cron = new CronJob({
      cronTime: CRON_EVERY_HOUR,
      onTick() {
        logger.log('[NORMALIZATION JOB] Starting normalization...')
        startNormalization()
      },
      timeZone: 'Europe/Paris'
    })
    cron.start()
  })
}

startJob()
