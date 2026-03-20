import { SaveDecisionUsecase } from './saveDecision.usecase'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'

const mockUtils = new MockUtils()

const fakeFile = { originalname: 'decision.wpd' } as any

const fakeMetadonnees = mockUtils.mandatoryMetadonneesDtoMock

describe('SaveDecisionUsecase', () => {
  describe('execute', () => {
    it('checks that a new decision has events.type and events.date', async () => {
      // GIVEN
      const mockDecisionRepository = { saveDecisionIntegre: jest.fn() }
      const mockRawFilesRepository = { createFileInformation: jest.fn() }
      const usecase = new SaveDecisionUsecase(mockDecisionRepository, mockRawFilesRepository)

      // WHEN
      await usecase.execute(fakeFile, fakeMetadonnees)

      // THEN
      const calledWith = mockRawFilesRepository.createFileInformation.mock.calls[0][0]
      expect(calledWith.events[0]).toEqual({ type: 'created', date: expect.any(Date) })
    })
  })
})
