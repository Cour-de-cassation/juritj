import { getConversionCommandPath } from './transformWPDtoText'

jest.mock('../../normalization/index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  },
  normalizationContext: {
    start: jest.fn(),
    setCorrelationId: jest.fn()
  }
}))

describe('transform wordperfect document to text', () => {
  it('gets conversion command path from executable', async () => {
    // GIVEN
    const execCommandName = 'cat'
    const expectedCommandPath = '/bin/cat'
    // WHEN
    expect(await getConversionCommandPath(execCommandName))
      // THEN
      .toEqual(expectedCommandPath)
  })

  it('throws an error when conversion command does not exist', async () => {
    // GIVEN
    const execCommandName = 'fakeCommand'
    // WHEN
    await expect(async () => await getConversionCommandPath(execCommandName))
      .rejects // THEN
      .toThrow(Error)
  })

  // Mis en commentaire car test d'intégration ?
  // Difficile de tester unitairement readWordPerfectDocument

  // it('converts a wordperfect document to text', async () => {
  //   // GIVEN
  //   const mockFilename = "mockFile.wpd"
  //   const mockBlob = new Blob(["my wordperfect document"], {type: 'application/vnd.wordperfect'})
  //   mockBlob["name"] = mockFilename

  //   const mockFile = <File>mockBlob
  //   // WHEN
  //   await readWordperfectDocument(mockFilename)
  //   // THEN

  // })
})
