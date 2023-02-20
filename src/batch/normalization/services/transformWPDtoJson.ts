import { promisify } from 'util'
import { exec } from 'child_process'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { logger } from '..'
import { existsSync } from 'fs'

const execPromise = promisify(exec)

const CONVERSION_COMMAND = 'wpd2text'

// Etant susceptible de pas être prod ready (en attente d'installer la commande sur l'env de dev)
// on met par defaut ce qu'on renvoyait avant
export async function readWordperfectDocument(filename: string) {
  const cmdPath = await getConversionCommandPath()
  if (cmdPath && existsSync(filename)) {
    const { stdout } = await execPromise('wpd2text ./' + filename)
    return stdout
  } else {
    return new MockUtils().decisionContent
  }
}

// Est-ce qu'on se dit qu'on rend générique la fonction  ou est-ce qu'on la focalise sur notre besoin
// qui est de recupérer une commande spécifique ?
export async function getConversionCommandPath(): Promise<string> {
  // TO DO : condition que wpd2text existe et récupérer le path
  return await execPromise('which ' + CONVERSION_COMMAND)
    .then((response) => {
      return response.stdout.replace(/\n/g, '')
    })
    .catch((e) => {
      logger.warn('[NORMALIZATION JOB] Unable to find the command to do the conversion... Skipping')
      return null
    })
}
