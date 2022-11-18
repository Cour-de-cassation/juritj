import { Type } from 'class-transformer'
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class PresidentDto {
  @IsString()
  fctPresident: string
}
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

  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numRG: string

  //...

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PresidentDto)
  president: PresidentDto
}
