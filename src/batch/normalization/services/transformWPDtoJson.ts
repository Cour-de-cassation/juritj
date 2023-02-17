import { promisify } from 'util'
import { exec } from 'child_process'
const execPromise = promisify(exec)

export async function readWpd(filename: string) {
  console.log(await getCommandPath('wpd2text'))

  // TO DO : voir si le fichier existe .wpd
  const { stdout, stderr } = await execPromise('wpd2text ./' + filename)
  // console.log('error');
  // console.log(stderr);
  // console.log('sortie');
  // console.log(stdout);

  return stdout
}

export async function getCommandPath(commandName: string): Promise<string> {
  // TO DO : condition que wpd2text existe et récupérer le path
  return await execPromise('which ' + commandName)
    .then((response) => {
      return response.stdout.replace(/\n/g, '')
    })
    .catch((e) => {
      console.log(e)
      return null
    })
}

readWpd('business_plan2.wpd')
