import { MockUtils } from '../../utils/mock'

const mockSaveDecisionFile = jest.fn()
const mockSaveFileMetadata = jest.fn()

jest.mock('../../connectors/s3', () => ({
  saveDecisionFile: (...args: unknown[]) => mockSaveDecisionFile(...args)
}))

jest.mock('../../connectors/mongodb', () => ({
  saveFileMetadata: (...args: unknown[]) => mockSaveFileMetadata(...args)
}))

import { saveDecision } from './handler'

const mockUtils = new MockUtils()

const fakeFile = { originalname: 'decision.wpd' } as Express.Multer.File

const fakeMetadonnees = mockUtils.mandatoryMetadonneesDtoMock

describe('saveDecision handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSaveDecisionFile.mockResolvedValue(undefined)
    mockSaveFileMetadata.mockResolvedValue({ _id: 'fake-id' })
  })

  describe('execute', () => {
    it('checks that a new decision has events.type and events.date', async () => {
      await saveDecision(fakeFile, fakeMetadonnees)

      const calledWith = mockSaveFileMetadata.mock.calls[0][0]
      expect(calledWith.events[0]).toEqual({ type: 'created', date: expect.any(Date) })
    })

    it('returns a filename with .json extension', async () => {
      const result = await saveDecision(fakeFile, fakeMetadonnees)

      expect(result).toMatch(/\.json$/)
    })

    it('calls saveDecisionFile with the file', async () => {
      await saveDecision(fakeFile, fakeMetadonnees)

      expect(mockSaveDecisionFile).toHaveBeenCalledTimes(1)
    })

    it('calls saveFileMetadata with correct structure', async () => {
      await saveDecision(fakeFile, fakeMetadonnees)

      expect(mockSaveFileMetadata).toHaveBeenCalledTimes(1)
      const calledWith = mockSaveFileMetadata.mock.calls[0][0]
      expect(calledWith).toHaveProperty('path')
      expect(calledWith).toHaveProperty('events')
      expect(calledWith).toHaveProperty('metadatas')
      expect(calledWith.metadatas).toEqual(fakeMetadonnees)
    })
  })
})
