import { promisify } from 'util'
import { exec } from 'child_process'
import { logger } from '..'
import { existsSync } from 'fs'

const execPromise = promisify(exec)
const CONVERSION_COMMAND = 'wpd2text'

// Etant susceptible de pas être prod ready (en attente d'installer la commande sur l'env de dev)
// on met par defaut ce qu'on renvoyait avant
export async function readWordperfectDocument(filename: string) {
  const cmdPath = await getConversionCommandPath(CONVERSION_COMMAND)
  if (cmdPath && existsSync(filename)) {
    try {
      const { stdout } = await execPromise('wpd2text ./' + filename)
      return stdout
    } catch (error) {
      logger.error('[NORMALIZATION JOB] Unable execute the conversion command.')
      throw new Error(error)
    }
  } else {
    logger.error('[NORMALIZATION JOB] Unable to read Wordperfect document.')
    throw new Error()
  }
}

// Est-ce qu'on se dit qu'on rend générique la fonction  ou est-ce qu'on la focalise sur notre besoin
// qui est de recupérer une commande spécifique ?
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
      // return null
    })
}
