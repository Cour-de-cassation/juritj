import { promisify } from 'util'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { logger } from '../index'

const execPromise = promisify(exec)
const CONVERSION_COMMAND = 'wpd2text'

export async function readWordperfectDocument(filename: string) {
  const cmdPath = await getConversionCommandPath(CONVERSION_COMMAND)
  if (cmdPath && existsSync(filename)) {
    try {
      const { stdout } = await execPromise('wpd2text ./' + filename)
      return stdout
    } catch (error) {
      logger.error('Unable to execute the conversion command.')
      throw new Error(error)
    }
  } else {
    logger.error('Unable to read Wordperfect document.')
    throw new Error()
  }
}

export async function getConversionCommandPath(commandName: string): Promise<string> {
  return await execPromise('which ' + commandName)
    .then((response) => {
      return response.stdout.replace(/\n/g, '')
    })
    .catch(() => {
      logger.error('Unable to find the command to do the conversion... Skipping')
      throw new Error()
    })
}
