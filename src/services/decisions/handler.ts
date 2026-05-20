import { v4 as uuidv4 } from 'uuid'
import { Metadonnees } from './models'
import { saveDecisionFile } from '../../connectors/s3'
import { saveFileMetadata, RawFile } from '../../connectors/mongodb'

export async function saveDecision(
  decisionIntegre: Express.Multer.File,
  metadonnees: Metadonnees
): Promise<string> {
  const wpdFileExtension = '.wpd'
  const decisionFileName = uuidv4() + wpdFileExtension
  const fileNameToReturn = decisionFileName.replace('.wpd', '.json')

  decisionIntegre.originalname = decisionFileName

  await saveDecisionFile(decisionIntegre)
  await saveFileMetadata<RawFile>({
    path: decisionFileName,
    events: [{ type: 'created', date: new Date() }],
    metadatas: metadonnees
  })

  return fileNameToReturn
}
