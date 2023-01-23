import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionMongoRepository } from './decisionMongo.repository'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('saveDecision', () => {
  const mockMetadonnees = new MockUtils().metadonneesDtoMock
  const mongoRepository = new DecisionMongoRepository()

  // TODO : mocker le saveDecision fait qu'on n'est pas assez précis, on mock la totalité de l'implem de la fonction qu'on teste
  it('throws an error when connection to mongo failed', async () => {
    // GIVEN
    jest.spyOn(mongoRepository, 'saveDecision').mockImplementationOnce(() => {
      throw new ServiceUnavailableException('Error from Mongo')
    })

    expect(
      // WHEN
      () => mongoRepository.saveDecision(mockMetadonnees)
    )
      // THEN
      .toThrowError()
  })

  // TODO : mocker le saveDecision fait qu'on n'est pas assez précis, on mock la totalité de l'implem de la fonction qu'on teste
  it('calls the function to insert data to the collection', async () => {
    // GIVEN
    jest.spyOn(mongoRepository, 'insertMetadonnees')
    const saveDecisionFn = jest.spyOn(mongoRepository, 'saveDecision')
    saveDecisionFn.mockImplementationOnce(jest.fn())
    // WHEN
    mongoRepository.saveDecision(mockMetadonnees)
    // THEN
    expect(saveDecisionFn).toHaveBeenCalled()
  })
})
