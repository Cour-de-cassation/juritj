import { jest, describe, expect, it, beforeEach } from '@jest/globals'
import { MockUtils } from '../../utils/mock'
import { saveDecision } from './handler'
import { saveDecisionFile } from '../../connectors/s3'
import { saveFileMetadata } from '../../connectors/mongodb'
import { ObjectId } from 'mongodb'

jest.mock('../../connectors/s3', () => ({
  saveDecisionFile: jest.fn()
}))

jest.mock('../../connectors/mongodb', () => ({
  saveFileMetadata: jest.fn()
}))

const mockSaveDecisionFile = jest.mocked(saveDecisionFile)
const mockSaveFileMetadata = jest.mocked(saveFileMetadata)

const mockUtils = new MockUtils()

const fakeFile = { originalname: 'decision.wpd' } as Express.Multer.File

const fakeMetadonnees = mockUtils.mandatoryMetadonneesDtoMock

describe('saveDecision handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSaveDecisionFile.mockResolvedValue(undefined)
    mockSaveFileMetadata.mockResolvedValue({ _id: new ObjectId('111111111111111111111111') })
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
