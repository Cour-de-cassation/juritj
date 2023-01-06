import * as fs from 'fs'
import * as path from 'path'

// Ajout d'un export pour que la fonction soit testé
function readEnvironmentFile() {
  const contents = fs.readFileSync(path.join(__dirname, '../../../../.env'), 'utf-8')
  const rawEnvironmentContent = contents.split(/\r?\n/)

  // step 1 : enlever les ## et lignes vides
  const cleanEnvContent = rawEnvironmentContent.filter((item) => {
    if (item === '' || item[0] === '#') {
      return false
    } else return true
  })

  // step 2 : separer la cle de la valeur (=)
  const mapEnv = cleanEnvContent.map((item) => {
    return [item.substring(0, item.indexOf('=')), item.substring(item.indexOf('=') + 1)]
  })
  // step 3 : transformer en objet : DOC_LOGIN : valueLogin ==> env[DOC_LOGIN] = valueLogin

  return mapEnv.reduce((result, item) => {
    result[item[0]] = item[1]
    return result
  }, {})
}

export function getEnvironment(key: string): string {
  // eslint-disable-next-line no-process-env
  const env = readEnvironmentFile()[key]

  if (!env) {
    // Pour fonctionner avec l'environnement de développement
    if (!process.env[key]) {
      throw new Error(`${key} is not defined`)
    } else {
      return process.env[key]
    }
  }
  return env
}
