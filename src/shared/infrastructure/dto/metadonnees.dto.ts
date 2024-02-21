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
import { Occultation, QualitePartie, TypePartie } from 'dbsder-api-types'

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

  @ApiPropertyOptional({
    description: 'Prénom du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.prenom
  })
  @IsString()
  @IsOptional()
  prenom?: string

  @ApiPropertyOptional({
    description: 'Civilité du président de jugement',
    type: String,
    example: new MockUtils().presidentDtoMock.civilite
  })
  @IsString()
  @IsOptional()
  civilite?: string
}

export class DecisionAssocieeDto {
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

  @ApiPropertyOptional({
    description: 'Identifiant de la décision associée dans le système source WinCI-TGI',
    type: String,
    example: 'idExemple'
  })
  @IsString()
  @IsOptional()
  idDecision?: string
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

  @ApiPropertyOptional({
    description: "Numéro de la mesure d'instruction",
    type: String,
    example: new MockUtils().allAttributesMetadonneesDtoMock.numeroMesureInstruction
  })
  @IsString({ each: true })
  @Length(10, 10, { each: true })
  @IsOptional()
  numeroMesureInstruction?: string[]

  @ApiProperty({
    description: 'Identifiant du service de la juridiction. Au format: ^[\\S]{2}$',
    type: String,
    example: metadonneesDtoExample.codeService
  })
  @IsString()
  @Matches('^[\\S]{2}$')
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

  @ApiPropertyOptional({
    description: 'Décision intègre chainée à la décision',
    type: DecisionAssocieeDto,
    example: metadonneesDtoExample.decisionAssociee
  })
  @IsOptional()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DecisionAssocieeDto)
  decisionAssociee?: DecisionAssocieeDto

  @ApiPropertyOptional({
    description: 'Liste des parties de la décision',
    type: [PartieDto],
    example: metadonneesDtoExample.parties
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PartieDto)
  parties?: PartieDto[]

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

  @ApiPropertyOptional({
    description: "Complément d'information du code NAC. Au format : ^[0-9a-zA-Z ]{0,2}$",
    type: String,
    example: metadonneesDtoExample.codeNature
  })
  @IsOptional()
  @IsString()
  @Matches('^[0-9a-zA-Z ]{0,2}$')
  codeNature?: string

  @ApiPropertyOptional({
    description: 'Libellé du code de nature particulière',
    type: String,
    example: metadonneesDtoExample.libelleNature
  })
  @IsOptional()
  @IsString()
  libelleNature?: string

  @ApiProperty({
    description: 'Caractère public de la décision',
    type: Boolean,
    example: metadonneesDtoExample.decisionPublique
  })
  @IsBoolean()
  decisionPublique: boolean

  @ApiProperty({
    description: "Utilisation des recommandations pour l'occultation",
    enum: Occultation,
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
    example: metadonneesDtoExample.matiereDeterminee
  })
  @IsBoolean()
  matiereDeterminee: boolean

  @ApiProperty({
    description: "Pourvoi local d'une décision",
    type: Boolean,
    example: metadonneesDtoExample.pourvoiLocal
  })
  @IsBoolean()
  pourvoiLocal: boolean

  @ApiProperty({
    description: "Pourvoi de Cour de Cassation d'une décision",
    type: Boolean,
    example: metadonneesDtoExample.pourvoiCourDeCassation
  })
  @IsBoolean()
  pourvoiCourDeCassation: boolean

  @ApiProperty({
    description: "Débat public d'une décision",
    type: Boolean,
    example: metadonneesDtoExample.debatPublic
  })
  @IsBoolean()
  debatPublic: boolean

  @ApiPropertyOptional({
    description: 'Identifiant de la décision dans le système source WinCI-TGI',
    type: String,
    example: 'idExemple'
  })
  @IsString()
  @IsOptional()
  idDecision?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Indicateur QPC',
    type: Boolean,
    example: false
  })
  indicateurQPC?: boolean
}
