import { promisify } from 'util'
import { exec } from 'child_process'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
//import { logger } from '..'
import { existsSync } from 'fs'

const execPromise = promisify(exec)

const CONVERSION_COMMAND = 'wpd2text'

// Etant susceptible de pas être prod ready (en attente d'installer la commande sur le pod du cron)
// on met par defaut ce qu'on renvoyait avant
export async function readWpd(filename: string) {
  const cmdPath = await getConversionCommandPath()
  if (cmdPath && isDecisionFilePresent(filename)) {
    console.log('all good')

    const { stdout, stderr } = await execPromise('wpd2text ./' + filename)
    return stdout
  } else {
    console.log('file not present')
    return new MockUtils().decisionContent
  }
  // TO DO : voir si le fichier existe .wpd
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
      console.log(e)
      //logger.error('[NORMALIZATION JOB] Unable to find the command to do the conversion .. skipping')
      return null
    })
}

export function isDecisionFilePresent(filename: string): boolean {
  return existsSync(filename)
}

readWpd('business_plan2.wpd')
