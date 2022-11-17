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
    jurisdictionCode: 'code',
    numRegistre: 'A'
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
  })

  it('returns provided object when provided object is a MetadonneeDto with valid properties', async () => {
    // WHEN
    const response = await target.transform(someValidMetaDonneeDto, metadata)
    // THEN
    expect(response).toEqual(someValidMetaDonneeDto)
  })
})
