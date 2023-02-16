import { promisify } from 'util'
import { exec } from 'child_process'
const execPromise = promisify(exec)

export async function readWpd(filename: string) {
  const { stdout } = await execPromise('/usr/local/bin/wpd2text ./' + filename)
  return stdout
}
