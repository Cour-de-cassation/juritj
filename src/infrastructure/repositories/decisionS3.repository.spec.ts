import { DecisionS3Repository } from './decisionS3.repository'

describe('DecisionS3Repository', () => {
  // simule la création du client s3
  const mockedPutObject = jest.fn()
  jest.mock('aws-sdk/clients/s3', () => {
    return class S3 {
      putObject(params, cb) {
        mockedPutObject(params, cb)
        return {
          /* afin de pouvoir afficher les logs */
          httpRequest: {
            method: 'PUT',
            path: '/filename.wpd',
            endpoint: { href: '' }
          }
        }
      }
    }
  })
  const repository = new DecisionS3Repository()
  describe('saveDecision', () => {
    it('throws error when s3 called failed', () => {
      // GIVEN
      const filename = 'test.wpd'
      const requestS3Dto = { decisionIntegre: 'decision', metadonnees: 'metadonnees' }
      // WHEN
      repository.saveDecision(JSON.stringify(requestS3Dto), filename)
      // THEN
    })
  })
})
