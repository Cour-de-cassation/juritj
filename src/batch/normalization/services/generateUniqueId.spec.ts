import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { generateUniqueId } from './generateUniqueId'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

const mockUtils = new MockUtils()
const metadonnees = mockUtils.metadonneesDtoMock

describe('Generates a unique ID based on metadata', () => {
  it('adds a unique ID as a idDecision property to metadata when required properties are provided', () => {
    // GIVEN
    const someMetadonnees = { ...metadonnees }
    const expected = mockUtils.uniqueDecisionId

    // WHEN
    const actual = generateUniqueId(someMetadonnees)

    // THEN
    expect(actual).toEqual(expected)
  })

  it('adds a unique ID as a idDecision property to metadata when only mandatory properties are provided', () => {
    // GIVEN
    const metadonneesWithEmptyNumeroMesureInstruction = { ...metadonnees }
    metadonneesWithEmptyNumeroMesureInstruction.numeroMesureInstruction = ''
    const expected = mockUtils.uniqueDecisionIdWithoutNumeroMesureInstruction

    // WHEN
    const actual = generateUniqueId(metadonneesWithEmptyNumeroMesureInstruction)

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
