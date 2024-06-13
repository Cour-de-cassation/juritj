import { existsSync, statSync } from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'
import { logger, normalizationFormatLogs } from '../index'
import { LogsFormat } from 'src/shared/infrastructure/utils/logsFormat.utils'

const execPromise = promisify(exec)
const CONVERSION_COMMAND = 'wpd2text'

export async function readWordperfectDocument(filename: string) {
  const formatLogs: LogsFormat = {
    ...normalizationFormatLogs,
    operationName: 'readWordperfectDocument'
  }
  const cmdPath = await getConversionCommandPath(CONVERSION_COMMAND)
  if (cmdPath && existsSync(filename)) {
    try {
      if (!statSync(filename).isFile()) {
        logger.error({
          ...normalizationFormatLogs,
          msg: `Path provided is not a file: ${filename}`
        })
        throw new Error()
      }

      // Escape the quote character in the filename in case of renormalization of decisions received at the beginning of the project that may contain quotes in filenames.
      const { stdout } = await execPromise("wpd2text '" + filename.replace(/'/g, `'\\''`) + "'")
      return stdout
    } catch (error) {
      logger.error({
        ...formatLogs,
        msg: error.message,
        data: error
      })
      throw new Error(error)
    }
  } else {
    logger.error({
      ...normalizationFormatLogs,
      msg: 'Unable to read Wordperfect document.'
    })
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
