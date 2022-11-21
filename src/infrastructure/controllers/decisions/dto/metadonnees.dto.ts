import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class MetadonneesDto {
  @ApiProperty({
    description: 'Nom de la juridiction émetrice de la décision.',
    type: String
  })
  @IsString()
  juridictionName: string
}
