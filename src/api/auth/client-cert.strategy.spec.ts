import { ClientCertStrategy } from './client-cert.strategy'
import { UnauthorizedException } from '@nestjs/common'

const emptyCertificate = {
  C: '',
  CN: '',
  L: '',
  O: '',
  OU: '',
  ST: ''
}

describe('ClientCertStrategy', () => {
  describe('validate', () => {
    const certStrategy = new ClientCertStrategy()
    it('throws an unauthorized error if my certificate is not valid', async () => {
      // GIVEN
      const certificate = {
        subject: { ...emptyCertificate, CN: 'TEST' },
        raw: '',
        issuer: emptyCertificate,
        issuerInfo: emptyCertificate,
        valid_from: '',
        valid_to: '',
        fingerprint: 'string',
        serialNumber: 'string'
      }
      // WHEN
      expect(certStrategy.validate(certificate))
        // THEN
        .rejects.toThrow(UnauthorizedException)
    })

    it('returns identity when certificate is validate', async () => {
      // GIVEN
      const certificate = {
        subject: { ...emptyCertificate, CN: 'CC' },
        raw: '',
        issuer: emptyCertificate,
        issuerInfo: emptyCertificate,
        valid_from: '',
        valid_to: '',
        fingerprint: 'string',
        serialNumber: 'string'
      }
      const expectedResult = { user: { name: 'CC' } }

      // WHEN
      const result = await certStrategy.validate(certificate)

      expect(result)
        // THEN
        .toEqual(expectedResult)
    })
  })
})
