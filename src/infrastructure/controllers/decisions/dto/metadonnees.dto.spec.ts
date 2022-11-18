import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { MetadonneesDto } from './metadonnees.dto'
import { ValidateDtoPipe } from '../../../pipes/validateDto.pipe'

describe('Validate MetadonneeDTO format', () => {
  const target = new ValidateDtoPipe()
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: MetadonneesDto,
    data: ''
  }

  const someValidMetaDonneeDto = {
    juridictionName: 'some juridiction name',
    juridictionId: 'TJ00000',
    numRegistre: 'A',
    numRG: '01/12345',
    numMesureInstruction: '0123456789',
    president: {
      fctPresident: 'president'
    }
  }

  describe('juridictionName property', () => {
    it('throws an error when juridictionName is not a string', async () => {
      // GIVEN
      const invalidJuridictionName = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionName is a too long string', async () => {
      // GIVEN
      const invalidJuridictionName = 'Some jurisdiction name which is way too long to fit'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionName is a too short string', async () => {
      // GIVEN
      const invalidJuridictionName = 'S'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('juridictionId property', () => {
    it('throws an error when juridictionId is invalid', async () => {
      // GIVEN
      const invalidJuridictionId = 'INVALID'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      const failingPropertyName = 'juridictionId'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionId is not a string', async () => {
      // GIVEN
      const invalidJuridictionId = 1234
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      const failingPropertyName = 'juridictionId'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('juridictionCode property', () => {
    it('throws an error when juridictionCode is not a string', async () => {
      // GIVEN
      const invalidJuridictionCode = 1234
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionCode: invalidJuridictionCode
      }
      const failingPropertyName = 'juridictionCode'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numRegistre property', () => {
    it('throws an error when numRegistre is not a string', async () => {
      // GIVEN
      const invalidNumRegistre = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRegistre: invalidNumRegistre
      }
      const failingPropertyName = 'numRegistre'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numRegistre different than length 1', async () => {
      // GIVEN
      const invalidNumRegistre = 'Some numRegistre name'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRegistre: invalidNumRegistre
      }
      const failingPropertyName = 'numRegistre'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numRG property', () => {
    it('throws an error when numRG is not a string', async () => {
      // GIVEN
      const invalidNumRG = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRG: invalidNumRG
      }
      const failingPropertyName = 'numRG'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numRG is invalid', async () => {
      // GIVEN
      const invalidNumRG = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, numRG: invalidNumRG }
      const failingPropertyName = 'numRG'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numMesureInstruction property', () => {
    it('throws an error when numMesureInstruction is not a string', async () => {
      // GIVEN
      const invalidNumMesureInstruction = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numMesureInstruction: invalidNumMesureInstruction
      }
      const failingPropertyName = 'numMesureInstruction'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numMesureInstruction different than length 10', async () => {
      // GIVEN
      const invalidNumMesureInstruction = 'short'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numMesureInstruction: invalidNumMesureInstruction
      }
      const failingPropertyName = 'numMesureInstruction'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe.skip('validate PresidentDTO format', () => {
    it('throws an error when president is not defined', async () => {
      // GIVEN
      const { president, ...invalidMetadonnee } = someValidMetaDonneeDto
      const failingPropertyName = 'president'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
    describe.skip('property fctPresident', () => {
      it('throws an error when fctPresident is not a string', async () => {
        // GIVEN
        const invalidFctPresident = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            fctPresident: invalidFctPresident
          }
        }
        const failingPropertyName = 'fctPresident'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })
  })

  it('returns provided object when provided object is a MetadonneeDto with valid properties', async () => {
    // WHEN
    const response = await target.transform(someValidMetaDonneeDto, metadata)
    // THEN
    expect(response).toEqual(someValidMetaDonneeDto)
  })
})
