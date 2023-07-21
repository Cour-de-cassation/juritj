import { generateUniqueId } from './generateUniqueId'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('Generates a unique ID based on metadata', () => {
  const mockUtils = new MockUtils()
  const metadonnees = mockUtils.mandatoryMetadonneesDtoMock

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('adds a unique ID property to metadata when required properties are provided', () => {
    // GIVEN
    const someMetadonnees = { ...metadonnees }
    const expected = mockUtils.uniqueDecisionId

    // WHEN
    const actual = generateUniqueId(someMetadonnees)

    // THEN
    expect(actual).toEqual(expected)
  })

  it('throws an error when required properties are not provided', () => {
    // GIVEN
    const metadonneesWithEmptyIdJuridiction = { ...metadonnees }
    metadonneesWithEmptyIdJuridiction.idJuridiction = ''

    // WHEN
    expect(() => generateUniqueId(metadonneesWithEmptyIdJuridiction))
      // THEN
      .toThrow(Error)
  })
})
