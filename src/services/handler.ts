import { v4 as uuidv4 } from 'uuid'
import { MetadonneesDto } from './models'
import { saveDecisionIntegre } from '../connectors/bucket'
import { createFileInformation } from '../connectors/dbRawFile'

export async function saveDecision(
  decisionIntegre: Express.Multer.File,
  metadonnees: MetadonneesDto
): Promise<string> {
  const wpdFileExtension = '.wpd'
  const decisionFileName = uuidv4() + wpdFileExtension

  // On ne sait pas quel est l'utilisation de la réponse par les utilisateurs
  // on conserve donc pour l'instant la réponse "historique" en .json
  const fileNameToReturn = decisionFileName.replace('.wpd', '.json')

  decisionIntegre.originalname = decisionFileName

  await saveDecisionIntegre(decisionIntegre)
  await createFileInformation({
    path: decisionFileName,
    events: [{ status: 'created', date: new Date() }],
    metadatas: metadonnees
  })

  return fileNameToReturn
}
