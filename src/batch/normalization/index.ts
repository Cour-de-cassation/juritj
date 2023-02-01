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
function startJob() {
  const cron = new CronJob({
    cronTime: CRON_EVERY_HOUR,
    onTick() {
      try {
        normalizationJob(decisionContent)
      } catch (error) {
        logger.error(error)
        logger.log('leaving normalization')
        process.exit(EXIT_ERROR_CODE)
      }
    },
    timeZone: 'Europe/Paris'
  })
  cron.start()
}

startJob()
