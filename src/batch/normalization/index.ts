import { CronJob } from 'cron'
import { Context } from '../../shared/infrastructure/utils/context'
import { CustomLogger } from '../../shared/infrastructure/utils/customLogger.utils'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { normalizationJob } from './normalization'

const decisionName = '2022-12-21T14:59:36.878ZDecision_TJ_exemple2.wpd'
const decisionContent = new MockUtils().decisionContent
const EXIT_ERROR_CODE = 1

export const normalizationContext = new Context()
export const logger = new CustomLogger(normalizationContext)

function startJob() {
  const cron = new CronJob({
    cronTime: '* * * * *',
    onTick() {
      try {
        normalizationJob(decisionName, decisionContent)
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
