import { Metadonnees } from './models'
import { saveDecisionFile } from '../../connectors/s3'
import { saveFileMetadata, RawFile } from '../../connectors/mongodb'
import { randomUUID } from 'node:crypto'

export async function saveDecision(
  decisionIntegre: Express.Multer.File,
  metadonnees: Metadonnees
): Promise<string> {
  const wpdFileExtension = '.wpd'
  const decisionFileName = randomUUID() + wpdFileExtension
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
