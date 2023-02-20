import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { readWordperfectDocument } from '../../../batch/normalization/services/transformWPDtoJson'

export async function getDecisionIntegreContent(decisionIntegre): Promise<string> {
  // créer le fichier
  writeFileSync(decisionIntegre.originalname, Buffer.from(decisionIntegre.buffer.data), {
    encoding: 'binary'
  })
  // lancer le script
  // recuperer son contenu dans une variable via le script
  const content = await readWordperfectDocument(decisionIntegre.originalname)
  // supprime le fichier
  if (existsSync(decisionIntegre.originalname)) {
    unlinkSync(decisionIntegre.originalname)
  }

  return content
}
