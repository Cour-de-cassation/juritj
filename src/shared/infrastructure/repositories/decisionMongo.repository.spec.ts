import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../utils/mock.utils'
import { DecisionMongoRepository } from './decisionMongo.repository'

describe('saveDecision', () => {
  const mockMetadonnees = new MockUtils().metadonneesDtoMock
  const mongoRepository = new DecisionMongoRepository()

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

  it('calls the function to insert data to the collection', async () => {
    // GIVEN
    jest.spyOn(mongoRepository, 'insertMetadonnees').mockReturnValueOnce(true)
    const saveDecisionFn = jest.spyOn(mongoRepository, 'saveDecision')
    saveDecisionFn.mockImplementationOnce(jest.fn())
    // WHEN
    mongoRepository.saveDecision(mockMetadonnees)
    // THEN
    expect(saveDecisionFn).toHaveBeenCalled()
  })
})
