import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class MetadonneesDto {
  @ApiProperty({
    description: 'Nom de la juridiction émetrice de la décision.',
    type: String
  })
  @IsString()
  @Length(2, 42)
  juridictionName: string

  @IsString()
  @Matches('^TJ[0-9]{5}$')
  juridictionId: string

  @IsOptional()
  jurisdictionCode: string

  @IsString()
  @Length(1)
  numRegistre: string
}
