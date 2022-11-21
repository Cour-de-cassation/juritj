import { Type } from 'class-transformer'
import {
  IsDateString,
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
  @IsString()
  juridictionCode: string

  @IsString()
  @Length(1, 1)
  numRegistre: string

  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numRG: string

  @IsString()
  @Length(10, 10)
  numMesureInstruction: string

  @IsString()
  @Matches('^[0-9a-zA-Z]{2}$')
  codeService: string

  @IsString()
  @Length(0, 25)
  libelleService: string

  @IsString()
  @Matches('^[0-9]{8}$')
  @IsDateString()
  dateDecision: string

  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  codeDecision: string

  @IsString()
  @Length(0, 200)
  libelleCodeDecision: string

  @IsDefined()
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PresidentDto)
  president: PresidentDto

  // ... Les spéciaux

  @IsString()
  @IsOptional()
  sommaire: string

  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  codeNAC: string

  @IsString()
  libelleNAC: string

  @IsString()
  @Matches('^[0-9a-zA-Z]{1,2}$')
  codeNature: string

  @IsString()
  libelleNature: string

  @IsString()
  @IsOptional()
  occultComp: string
}
