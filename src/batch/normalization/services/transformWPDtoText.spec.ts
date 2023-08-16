import { getConversionCommandPath } from './transformWPDtoText'

jest.mock('../../normalization/index', () => ({
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

describe('transform wordperfect document to text', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('gets conversion command path from executable', async () => {
    // GIVEN
    const execCommandName = 'cat'
    const expectedCommandPath = '/bin/cat'

    // WHEN
    expect(await getConversionCommandPath(execCommandName))
      // THEN
      .toMatch(expectedCommandPath)
  })

  it('throws an error when conversion command does not exist', async () => {
    // GIVEN
    const execCommandName = 'fakeCommand'

    // WHEN
    await expect(async () => await getConversionCommandPath(execCommandName))
      .rejects // THEN
      .toThrow(Error)
  })
})
