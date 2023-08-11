import { existsSync } from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'
import { logger } from '../index'
import { normalizationFormatLogs } from '../normalization'
import { LogsFormat } from 'src/shared/infrastructure/utils/logsFormat.utils'

const execPromise = promisify(exec)
const CONVERSION_COMMAND = 'wpd2text'

export async function readWordperfectDocument(filename: string) {
  const cmdPath = await getConversionCommandPath(CONVERSION_COMMAND)
  if (cmdPath && existsSync(filename)) {
    try {
      const { stdout } = await execPromise('wpd2text ./' + filename)
      return stdout
    } catch (error) {
      logger.error({ operationName: 'readWordperfectDocument', msg: error.message, data: error })
      throw new Error(error)
    }
  } else {
    const formatLogs: LogsFormat = {
      ...normalizationFormatLogs,
      operationName: 'readWordperfectDocument',
      msg: 'Unable to read Wordperfect document.'
    }
    logger.error(formatLogs)
    throw new Error()
  }
}

export async function getConversionCommandPath(commandName: string): Promise<string> {
  return await execPromise('which ' + commandName)
    .then((response) => {
      return response.stdout.replace(/\n/g, '')
    })
    .catch(() => {
      logger.error({
        operationName: 'getConversionCommandPath',
        msg: 'Unable to find the command to do the conversion... Skipping'
      })
      throw new Error()
    })
}
