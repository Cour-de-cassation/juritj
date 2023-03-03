import { Readable } from 'stream'
import * as util from 'util'
import { transformDecisionIntegreFromWPDToText } from './transformDecisionIntegreContent'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  unlinkSync: jest.fn()
}))

const responseMock = 'string with text'

const mockExec = jest.fn(() => {
  stdout: responseMock
})

jest.spyOn(util, 'promisify').mockImplementation(() => mockExec)

describe('transform decision integre content from WPD to text', () => {
  it.skip('retrieves the text from the wordperfect document', async () => {
    // GIVEN
    const fileName = 'ole6.wpd'
    const mockBuffer = Buffer.from(responseMock)

    const decisionIntegre: Express.Multer.File = {
      fieldname: 'decisionIntegre',
      originalname: fileName,
      encoding: '7bit',
      mimetype: 'application/vnd.wordperfect',
      size: 4,
      stream: new Readable(),
      destination: '',
      filename: fileName,
      path: '',
      buffer: mockBuffer
    }
    // WHEN
    const decisionIntegreTest = await transformDecisionIntegreFromWPDToText(decisionIntegre)
    // THEN
    expect(decisionIntegreTest).toBe(responseMock)
  })
})
