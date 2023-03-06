import { Readable } from 'stream'
import { transformDecisionIntegreFromWPDToText } from './transformDecisionIntegreContent'
import * as readWordperfectDocument from './transformWPDtoText'

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

//jest.spyOn(util, 'promisify').mockImplementation(() => mockExec)

describe('transform decision integre content from WPD to text', () => {
  it('retrieves the text from the wordperfect document', async () => {
    // GIVEN
    const fileName = 'ole6.wpd'
    const mockBuffer = Buffer.from(responseMock)
    jest
      .spyOn(readWordperfectDocument, 'readWordperfectDocument')
      .mockImplementationOnce(() => Promise.resolve(responseMock))

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

  it('throws an error when the process failed to convert', async () => {
    // GIVEN
    const fileName = 'ole6.wpd'
    const mockBuffer = Buffer.from(responseMock)
    jest.spyOn(readWordperfectDocument, 'readWordperfectDocument').mockImplementationOnce(() => {
      throw new Error('failed conversion')
    })

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
    expect(transformDecisionIntegreFromWPDToText(decisionIntegre))
      // THEN
      .rejects.toThrow(new Error('Could not get decision ' + fileName + ' content.'))
  })
})
