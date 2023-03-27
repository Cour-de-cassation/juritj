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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MockUtils } from '../utils/mock.utils'
import { Occultation, QualitePartie, TypePartie } from '../../domain/enums'

const metadonneesDtoExample = new MockUtils().allAttributesMetadonneesDtoMock

export class PresidentDto {
  @ApiProperty({
    description: 'Fonction du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.fonction
  })
  @IsString()
  fonction: string

  @ApiProperty({
    description: 'Nom du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.nom
  })
  @IsString()
  nom: string

  @ApiProperty({
    description: 'Prénom du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.prenom
  })
  @IsString()
  @IsOptional()
  prenom?: string

  @ApiProperty({
    description: 'Civilité du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.civilite
  })
  @IsString()
  @IsOptional()
  civilite?: string
}

export class DecisionDto {
  @ApiProperty({
    description: 'Numéro de registre de la décision associée',
    type: String,
    example: metadonneesDtoExample.decisionAssociee.numeroRegistre
  })
  @IsString()
  @Length(1, 1)
  numeroRegistre: string

  @ApiProperty({
    description:
      'Numéro RG (Rôle Général) du dossier. Année sur deux chiffres séparé par un «/» d’un numéro à cinq chiffres (0 non significatifs présents). Au format : ^[0-9]{2}/[0-9]{5}$',
    type: String,
    example: metadonneesDtoExample.decisionAssociee.numeroRoleGeneral
  })
  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral: string

  @ApiProperty({
    description:
      'Identifiant de la juridiction émettrice propre au système d’information originel pour la décision associée. Au format ^TJ[0-9]{5}$',
    type: String,
    example: metadonneesDtoExample.decisionAssociee.idJuridiction
  })
  @IsString()
  @Matches('^TJ[0-9]{5}$')
  idJuridiction: string

  @ApiProperty({
    description: 'Date de la décision associée. Au format AAAAMMJJ',
    type: String,
    example: metadonneesDtoExample.decisionAssociee.date
  })
  @IsString()
  @Matches('^[0-9]{8}$')
  @IsDateString()
  date: string
}

export class PartieDto {
  @ApiProperty({
    description: 'Type du partie de la décision',
    enum: TypePartie,
    example: metadonneesDtoExample.parties[0].type
  })
  @IsEnum(TypePartie)
  type: TypePartie

  @ApiProperty({
    description: 'Nom du partie de la décision',
    type: String,
    example: metadonneesDtoExample.parties[0].nom
  })
  @IsString()
  nom: string

  @ApiPropertyOptional({
    description: 'Prénom du partie de la décision',
    type: String,
    example: 'Prenom'
  })
  @IsString()
  @IsOptional()
  prenom?: string

  @ApiPropertyOptional({
    description: 'Civilité du partie de la décision',
    type: String,
    example: 'civilité'
  })
  @IsString()
  @IsOptional()
  civilite?: string

  @ApiPropertyOptional({
    description: 'Qualité du partie de la décision',
    enum: QualitePartie,
    example: 'Qualité'
  })
  @IsEnum(QualitePartie)
  @IsOptional()
  qualite?: QualitePartie
}

export class MetadonneesDto {
  @ApiProperty({
    description: 'Intitulé de la juridiction émettrice propre au système d’information originel',
    type: String,
    example: metadonneesDtoExample.nomJuridiction
  })
  @IsString()
  @Length(2, 42)
  nomJuridiction: string

  @ApiProperty({
    description:
      'Identifiant de la juridiction émettrice propre au système d’information originel. Au format ^TJ[0-9]{5}$',
    type: String,
    example: metadonneesDtoExample.idJuridiction
  })
  @IsString()
  @Matches('^TJ[0-9]{5}$')
  idJuridiction: string

  @ApiPropertyOptional({
    description: 'Code de la juridiction émettrice propre au système d’information originel.',
    type: String,
    example: 'Code juridiction'
  })
  @IsOptional()
  @IsString()
  codeJuridiction?: string

  @ApiProperty({
    description: 'Numéro de registre',
    type: String,
    example: metadonneesDtoExample.numeroRegistre
  })
  @IsString()
  @Length(1, 1)
  numeroRegistre: string

  @ApiProperty({
    description:
      'Numéro RG (Rôle Général) du dossier. Année sur deux chiffres séparé par un «/» d’un numéro à cinq chiffres (0 non significatifs présents). Au format : ^[0-9]{2}/[0-9]{5}$',
    type: String,
    example: metadonneesDtoExample.numeroRoleGeneral
  })
  @IsString()
  @Matches('^[0-9]{2}/[0-9]{5}$')
  numeroRoleGeneral: string

  @ApiProperty({
    description: "Numéro de la mesure d'instruction",
    type: String,
    example: new MockUtils().allAttributesMetadonneesDtoMock.numeroMesureInstruction
  })
  @IsArray()
  @IsString({ each: true })
  @Length(10, 10, { each: true })
  @IsOptional()
  numeroMesureInstruction?: string[]

  @ApiProperty({
    description: 'Identifiant du service de la juridiction. Au format: ^[0-9a-zA-Z]{2}$',
    type: String,
    example: metadonneesDtoExample.codeService
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{2}$')
  codeService: string

  @ApiProperty({
    description: 'Libellé du service de la juridiction',
    type: String,
    example: metadonneesDtoExample.libelleService
  })
  @IsString()
  @Length(0, 25)
  libelleService: string

  @ApiProperty({
    description: 'Date de rendu de la décision. Au format : AAAAMMJJ',
    type: String,
    example: metadonneesDtoExample.dateDecision
  })
  @IsString()
  @Matches('^[0-9]{8}$')
  @IsDateString()
  dateDecision: string

  @ApiProperty({
    description: 'Code du type de décision. Au format : ^[0-9a-zA-Z]{3}$',
    type: String,
    example: metadonneesDtoExample.codeDecision
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  codeDecision: string

  @ApiProperty({
    description: 'Libellé du type de décision',
    type: String,
    example: metadonneesDtoExample.libelleCodeDecision
  })
  @IsString()
  @Length(0, 200)
  libelleCodeDecision: string

  @ApiPropertyOptional({
    description: 'Information sur le président de la formation du jugement',
    type: () => PresidentDto,
    example: new MockUtils().presidentDtoMock
  })
  @IsDefined()
  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PresidentDto)
  president?: PresidentDto

  @ApiProperty({
    description: 'Décision intègre chainée à la décision',
    type: DecisionDto,
    example: metadonneesDtoExample.decisionAssociee
  })
  @IsOptional()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionDto)
  decisionAssociee?: DecisionDto

  @ApiProperty({
    description: 'Liste des parties de la décision',
    type: [PartieDto],
    example: metadonneesDtoExample.parties
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartieDto)
  parties: PartieDto[]

  @ApiPropertyOptional({
    description: 'Résumé de la décision intègre',
    type: String,
    example: 'Exemple de sommaire'
  })
  @IsString()
  @IsOptional()
  sommaire?: string

  @ApiProperty({
    description: 'Code NAC de la décision. Au format : ^[0-9a-zA-Z]{3}$',
    type: String,
    example: metadonneesDtoExample.codeNAC
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{3}$')
  codeNAC: string

  @ApiProperty({
    description: 'Libellé du code NAC de la décision',
    type: String,
    example: metadonneesDtoExample.libelleNAC
  })
  @IsString()
  libelleNAC: string

  @ApiProperty({
    description: "Complément d'information du code NAC. Au format : ^[0-9a-zA-Z]{1-2}$",
    type: String,
    example: metadonneesDtoExample.codeNature
  })
  @IsString()
  @Matches('^[0-9a-zA-Z]{1,2}$')
  codeNature: string

  @ApiProperty({
    description: 'Libellé du code de nature particulière',
    type: String,
    example: metadonneesDtoExample.libelleNature
  })
  @IsString()
  libelleNature: string

  @ApiProperty({
    description: 'Caractère public de la décision',
    type: Boolean,
    example: metadonneesDtoExample.decisionPublique
  })
  @IsBoolean()
  decisionPublique: boolean

  @ApiProperty({
    description: "Utilisation des recommandations pour l'occultation",
    type: Occultation,
    example: metadonneesDtoExample.recommandationOccultation
  })
  @IsEnum(Occultation)
  recommandationOccultation: Occultation

  @ApiPropertyOptional({
    description: "Champ libre contenant les demandes d'occultations complémentaires",
    type: String,
    example: "Exemple d'occultation complémentaire"
  })
  @IsString()
  @IsOptional()
  occultationComplementaire?: string

  @ApiProperty({
    description: "Selection d'une décision",
    type: Boolean,
    example: metadonneesDtoExample.selection
  })
  @IsBoolean()
  selection: boolean

  @ApiProperty({
    description: "Matière déterminée d'une décision",
    type: Boolean,
    example: metadonneesDtoExample.selection
  })
  @IsBoolean()
  matiereDeterminee: boolean
}
