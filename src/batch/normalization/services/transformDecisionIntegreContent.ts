import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { readWordperfectDocument } from './transformWPDtoText'

export async function transformDecisionIntegreFromWPDToText(
  decisionIntegre: Express.Multer.File
): Promise<string> {
  writeFileSync(decisionIntegre.originalname, Buffer.from(decisionIntegre.buffer), {
    encoding: 'binary'
  })
  try {
    const decisionIntegreContent = await readWordperfectDocument(decisionIntegre.originalname)
    return decisionIntegreContent
  } catch (error) {
    throw new Error('Could not get decision ' + decisionIntegre.originalname + ' content.')
  } finally {
    deleteTemporaryDecisionIntegre(decisionIntegre.originalname)
  }
}

function deleteTemporaryDecisionIntegre(filename: string) {
  if (existsSync(filename)) {
    unlinkSync(filename)
  }
}
