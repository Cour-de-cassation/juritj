import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { readWordperfectDocument } from './transformWPDtoText'

export async function transformDecisionIntegreFromWPDToText(decisionIntegre): Promise<string> {
  // decisionIntegre : nous n'avons pas réussi à identifier le type, car nous ne savons pas ce qui revient de S3

  writeFileSync(decisionIntegre.originalname, Buffer.from(decisionIntegre.buffer.data), {
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
