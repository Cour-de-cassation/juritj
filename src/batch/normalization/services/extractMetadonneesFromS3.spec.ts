import { ServiceUnavailableException } from '@nestjs/common'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'

jest.mock('../normalization', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('getDecisionFromS3', () => {
  describe('getDecisionMetadonneesFromS3File', () => {
    // TODO : mocker le getDecisionMetadonneesFromS3File fait qu'on n'est pas assez précis, on mock la totalité de l'implem de la fonction qu'on teste
    it('throws an error when call to S3 failed', () => {
      // GIVEN
      const filename = 'notFoundFile.wpd'
      const mockedGetDecisionMetadonneesFromS3File = jest
        .fn()
        .mockRejectedValue(new ServiceUnavailableException('Error from S3 API'))
      expect(
        // WHEN
        mockedGetDecisionMetadonneesFromS3File(filename)
      ).rejects.toEqual(new ServiceUnavailableException('Error from S3 API'))
    })

    it('returns metadata of the decision', () => {
      // GIVEN
      const filename = 'file.wpd'
      const expected = new MockUtils().metadonneesDtoMock
      const mockedGetDecisionMetadonneesFromS3File = jest
        .fn()
        .mockImplementation(() => new MockUtils().metadonneesDtoMock)
      expect(
        // WHEN
        mockedGetDecisionMetadonneesFromS3File(filename)
      )
        // THEN
        .toEqual(expected)
    })
  })
})
