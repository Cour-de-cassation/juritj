import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TypePartie, QualitePartie } from '../../../../domain/enums'
import { MockUtils } from '../../../utils/mock.utils'

export class PresidentDto {
  @IsString()
  fonction: string

  @IsString()
  nom: string

  @IsString()
  prenom: string

  @IsString()
  civilite: string
}

export class DecisionDto {
  @IsString()
  @Length(1, 1)
  numeroRegistre: string

  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral: string

  @IsString()
  @Matches('^TJ[0-9]{5}$')
  idJuridiction: string

  @IsString()
  @Matches('^[0-9]{8}$')
  @IsDateString()
  date: string

  @IsString()
  @Length(10, 10)
  numeroMesureInstruction: string
}

export class PartieDto {
  @IsEnum(TypePartie)
  type: TypePartie

  @IsString()
  nom: string

  @IsString()
  @IsOptional()
  prenom?: string

  @IsString()
  @IsOptional()
  civilite?: string

  @IsEnum(QualitePartie)
  @IsOptional()
  qualite?: QualitePartie
}

export class MetadonneesDto {
  @ApiProperty({
    description: 'Intitulé de la juridiction émettrice propre au système d’information originel',
    type: String,
    example: new MockUtils().metadonneesDtoMock.nomJuridiction
  })
  @IsString()
  @Length(2, 42)
  nomJuridiction: string

  @ApiProperty({
    description: 'Identifiant de la juridiction émettrice propre au système d’information originel',
    type: String,
    example: new MockUtils().metadonneesDtoMock.idJuridiction
  })
  @IsString()
  @Matches('^TJ[0-9]{5}$')
  idJuridiction: string

  @ApiProperty({
    description: 'Code de la juridiction émettrice propre au système d’information originel.',
    type: String,
    example: ''
  })
  @IsOptional()
  @IsString()
  codeJuridiction?: string

  @IsString()
  @Length(1, 1)
  numeroRegistre: string

  @ApiProperty({
    description:
      'Numéro RG (Rôle Général) du dossier. Année sur deux chiffres séparé par un «/» d’un numéro à cinq chiffres (0 non significatifs présents).',
    type: String,
    example: new MockUtils().metadonneesDtoMock.numeroRG
  })
  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral: string

  @IsString()
  @Length(10, 10)
  numeroMesureInstruction: string

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
  president?: PresidentDto

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DecisionDto)
  chainage?: DecisionDto[]

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionDto)
  decisionAssociee: DecisionDto

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartieDto)
  parties: PartieDto[]

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PartieDto)
  partie: PartieDto

  @IsString()
  @IsOptional()
  sommaire?: string

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

  @IsBoolean()
  public: boolean

  @IsBoolean()
  recommandationOccultation: boolean

  @IsString()
  @IsOptional()
  occultationComplementaire?: string
}
