import { promisify } from 'util'
import { exec } from 'child_process'
const execPromise = promisify(exec)

async function readWpd() {
  const { stdout, stderr } = await execPromise(
    '/Applications/LibreOffice.app/Contents/MacOS/soffice --cat /Users/maxime.gatineau/Documents/Missions/MinJu/business_plan.wpd'
  )
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
}

readWpd()
