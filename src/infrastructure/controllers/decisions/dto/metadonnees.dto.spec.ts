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

  it('throws an error when juridictionName is invalid', async () => {
    // GIVEN
    const invalidMetadonnee = { juridictionName: 123 }
    // WHEN
    await expect(target.transform(invalidMetadonnee, metadata))
      // THEN
      .rejects.toThrow(BadRequestException)
  })

  it("throws an error when juridictionName is invalid because it's too long", async () => {
    // GIVEN
    const invalidMetadonnee = {
      juridictionName: 'Some jurisdiction name which is way too long to fit'
    }
    // WHEN
    await expect(target.transform(invalidMetadonnee, metadata))
      // THEN
      .rejects.toThrow(BadRequestException)
  })

  it("throws an error when juridictionName is invalid because it's too short", async () => {
    // GIVEN
    const invalidMetadonnee = { juridictionName: 'S' }
    // WHEN
    await expect(target.transform(invalidMetadonnee, metadata))
      // THEN
      .rejects.toThrow(BadRequestException)
  })

  it('throws an error when juridictionId is invalid', async () => {
    // GIVEN
    const invalidMetadonnee = { juridictionName: 'S', juridictionId: 'INVALID' }
    // WHEN
    await expect(target.transform(invalidMetadonnee, metadata))
      // THEN
      .rejects.toThrow(BadRequestException)
  })

  it('returns provided object when juridictionName is valid', async () => {
    // GIVEN
    const validMetadonnee = {
      juridictionName: 'some juridiction name',
      juridictionId: 'TJ00000',
      jurisdictionCode: 'code',
      numRegistre: 'A'
    }
    // WHEN
    const response = await target.transform(validMetadonnee, metadata)
    // THEN
    expect(response).toEqual(validMetadonnee)
  })
})
