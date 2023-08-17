import { Readable } from 'stream'
import * as readWordperfectDocument from './transformWPDtoText'
import { transformDecisionIntegreFromWPDToText } from './transformDecisionIntegreContent'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  },
  normalizationFormatLogs: {
    operationName: 'normalizationJob',
    msg: 'Starting normalization job...'
  }
}))

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  unlinkSync: jest.fn()
}))

describe('transform decision integre content from WPD to text', () => {
  const responseMock = 'string with text'
  const mockBuffer = Buffer.from(responseMock)
  const fileName = 'someFileName.wpd'

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

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('retrieves the text from the wordperfect document', async () => {
    // GIVEN
    jest
      .spyOn(readWordperfectDocument, 'readWordperfectDocument')
      .mockImplementationOnce(() => Promise.resolve(responseMock))

    // WHEN
    const decisionIntegreTest = await transformDecisionIntegreFromWPDToText(decisionIntegre)
    // THEN
    expect(decisionIntegreTest).toBe(responseMock)
  })

  it('throws an error when the process failed to convert', async () => {
    // GIVEN
    jest.spyOn(readWordperfectDocument, 'readWordperfectDocument').mockImplementationOnce(() => {
      throw new Error()
    })

    // WHEN
    expect(transformDecisionIntegreFromWPDToText(decisionIntegre))
      // THEN
      .rejects.toThrow(Error)
  })
})
