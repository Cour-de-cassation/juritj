import { Readable } from 'stream'
import { CollectDto } from '../dto/collect.dto'
import { MockUtils } from '../utils/mock.utils'
import { CleanDecisionS3Repository } from './cleanDecisionS3.repository'

const mockUtils = new MockUtils()

describe('DecisionS3Repository', () => {
  describe('saveDecision', () => {
    it('saves the decision', () => {
      // GIVEN
      const decisionIntegre: Express.Multer.File = {
        fieldname: 'decisionIntegre',
        originalname: mockUtils.decisionName,
        encoding: '7bit',
        mimetype: 'application/vnd.wordperfect',
        size: 4,
        stream: new Readable(),
        destination: '',
        filename: mockUtils.decisionName,
        path: '',
        buffer: Buffer.from(mockUtils.decisionContent)
      }

      const mockDecision: CollectDto = {
        decisionIntegre,
        metadonnees: mockUtils.mandatoryMetadonneesDtoMock
      }

      // WHEN
      expect(CleanDecisionS3Repository.saveDecision(mockDecision))
        // THEN
        .toEqual('OK')
    })

    // it('throws error when S3 called failed', async () => {
    // })

    // it('saves the decision on S3', async () => {
    // })
  })

  describe('getDecisionByFilename', () => {
    // it('throws an error when the S3 could not be called', async () => {
    // })
    // it('returns the decision from s3', async () => {
    // })
  })

  describe('deleteDecision', () => {
    // it('throws error when S3 called failed', async () => {
    // })
    // it('deletes the decision on S3', async () => {
    // })
  })

  describe('getDecisionList', () => {
    // it('throws an error when the S3 could not be called', async () => {
    // })
    // it('returns the decision list from s3', async () => {
    // })
  })
})
