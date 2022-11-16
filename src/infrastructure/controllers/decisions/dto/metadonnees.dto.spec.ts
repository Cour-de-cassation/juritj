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

  it('juridictionName is invalid', async () => {
    // GIVEN
    const invalidMetadonnee = { juridictionName: 123 }
    // WHEN
    await expect(target.transform(invalidMetadonnee, metadata))
      // THEN
      .rejects.toThrow(BadRequestException)
  })
})
