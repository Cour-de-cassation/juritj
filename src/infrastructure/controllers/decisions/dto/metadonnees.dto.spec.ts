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

  it('returns provided object when juridictionName is valid', async () => {
    // GIVEN
    const validMetadonnee = { juridictionName: 'some juridiction name' }
    // WHEN
    const response = await target.transform(validMetadonnee, metadata)
    // THEN
    expect(response).toEqual(validMetadonnee)
  })
})
