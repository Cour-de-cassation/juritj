import { promisify } from 'util'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { logger } from '../index'

const execPromise = promisify(exec)
const CONVERSION_COMMAND = 'wpd2text'

export async function readWordperfectDocument(filename: string) {
  const cmdPath = await getConversionCommandPath(CONVERSION_COMMAND)
  if (cmdPath && existsSync(filename)) {
    console.log('if')
    try {
      const { stdout } = await execPromise('wpd2text ./' + filename)
      return stdout
    } catch (error) {
      console.log('catch')

      logger.error('[NORMALIZATION JOB] Unable to execute the conversion command.')
      throw new Error(error)
    }
  } else {
    console.log('else')

    logger.error('[NORMALIZATION JOB] Unable to read Wordperfect document.')
    throw new Error()
  }
}

export async function getConversionCommandPath(commandName: string): Promise<string> {
  return await execPromise('which ' + commandName)
    .then((response) => {
      logger.log('[NORMALIZATION JOB] Command to convert found !')
      return response.stdout.replace(/\n/g, '')
    })
    .catch(() => {
      logger.error(
        '[NORMALIZATION JOB] Unable to find the command to do the conversion... Skipping'
      )
      throw new Error()
    })
}
