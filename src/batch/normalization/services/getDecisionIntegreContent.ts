import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { readWordperfectDocument } from './transformWPDtoText'

export async function getDecisionIntegreContent(decisionIntegre): Promise<string> {
  // créer le fichier
  writeFileSync(decisionIntegre.originalname, Buffer.from(decisionIntegre.buffer.data), {
    encoding: 'binary'
  })
  // lancer le script
  // recuperer son contenu dans une variable via le script

  // Try / Catch pour s'assurer de la suppression du fichier dans le cas d'une erreur
  try {
    const decisionIntegreContent = await readWordperfectDocument(decisionIntegre.originalname)
    deleteDecisionIntegre(decisionIntegre.originalname)
    return decisionIntegreContent
  } catch (error) {
    deleteDecisionIntegre(decisionIntegre.originalname)
    // Throw error, est-ce nécessaire ?
    // Mis pour faire un try/catch dans normalization
    throw new Error('Could not get decision ' + decisionIntegre.originalname + ' content.')
  }
}

function deleteDecisionIntegre(filename) {
  if (existsSync(filename)) {
    unlinkSync(filename)
  }
}
