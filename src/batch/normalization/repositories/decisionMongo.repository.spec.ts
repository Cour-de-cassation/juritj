import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { DecisionMongoRepository } from './decisionMongo.repository'
import mongoose from 'mongoose'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('saveDecision', () => {
  const mockMetadonnees = new MockUtils().metadonneesDtoMock
  const mongoRepository = new DecisionMongoRepository()

  it('throws an error when connection to mongo failed', async () => {
    // GIVEN
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      throw new ServiceUnavailableException('Error from database')
    })

    expect(
      // WHEN
      mongoRepository.saveDecision(mockMetadonnees)
    )
      // THEN
      .rejects.toEqual(new ServiceUnavailableException('Error from database'))
  })

  it('calls the function to insert data to the collection', async () => {
    // GIVEN
    jest.spyOn(mongoose, 'connect').mockImplementation(() => {
      return {
        model: jest.fn()
      } as any
    })
    const insertDataMock = jest
      .spyOn(mongoRepository, 'insertMetadonnees')
      .mockImplementation(async () => {
        return mockMetadonnees
      })

    // WHEN
    await mongoRepository.saveDecision(mockMetadonnees)

    // THEN
    expect(insertDataMock).toHaveBeenCalled()
  })
})
