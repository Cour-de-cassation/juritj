import zod from 'zod'
import { TypePartieExhaustive, QualitePartieExhaustive, SuiviOccultation } from 'dbsder-api-types'
import { NotSupported, toNotSupported } from './error'

const schemaPresidentDto = zod.object({
  fonction: zod.string(),
  nom: zod.string(),
  prenom: zod.string(),
  civilite: zod.string()
})

const schemaDecisionAssocieeDto = zod.object({
  numeroRegistre: zod.string().length(1),
  numeroRoleGeneral: zod.string().regex(/^[0-9]{2}\/[0-9]{5}$/),
  idJuridiction: zod.string().regex(/^TJ[0-9A-Z]{5}$/),
  date: zod
    .string()
    .regex(/^[0-9]{8}$/)
    .refine((val) => !isNaN(Date.parse(val)), { message: 'date must be a valid date string' }),
  idDecision: zod.string().optional()
})

const schemaPartieDto = zod.object({
  type: zod.nativeEnum(TypePartieExhaustive),
  nom: zod.string(),
  prenom: zod.string().optional(),
  civilite: zod.string().optional(),
  qualite: zod.nativeEnum(QualitePartieExhaustive).optional()
})

const schemaMetadonnees = zod.object({
  nomJuridiction: zod.string().min(2).max(42),
  idJuridiction: zod.string().regex(/^TJ[0-9A-Z]{5}$/),
  codeJuridiction: zod.string().optional(),
  numeroRegistre: zod.string().length(1),
  numeroRoleGeneral: zod.string().regex(/^[0-9]{2}\/[0-9]{5}$/),
  numeroMesureInstruction: zod.array(zod.string().length(10)).optional(),
  codeService: zod.string().regex(/^.{2}$/),
  libelleService: zod.string().max(25),
  dateDecision: zod
    .string()
    .regex(/^[0-9]{8}$/)
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'dateDecision must be a valid date string'
    }),
  codeDecision: zod.string().regex(/^[0-9a-zA-Z]{3}$/),
  libelleCodeDecision: zod.string().max(200),
  president: schemaPresidentDto.optional(),
  decisionAssociee: schemaDecisionAssocieeDto.optional(),
  parties: zod.array(schemaPartieDto).optional(),
  sommaire: zod.string().optional(),
  codeNAC: zod.string().regex(/^[0-9a-zA-Z]{3}$/),
  libelleNAC: zod.string(),
  codeNature: zod
    .string()
    .regex(/^[0-9a-zA-Z ]{0,2}$/)
    .optional(),
  libelleNature: zod.string().optional(),
  decisionPublique: zod.boolean(),
  recommandationOccultation: zod.nativeEnum(SuiviOccultation),
  occultationComplementaire: zod.string().optional(),
  selection: zod.boolean(),
  matiereDeterminee: zod.boolean(),
  pourvoiLocal: zod.boolean(),
  pourvoiCourDeCassation: zod.boolean(),
  debatPublic: zod.boolean(),
  idDecision: zod.string().optional(),
  indicateurQPC: zod.boolean().optional()
})

export type MetadonneesDto = zod.infer<typeof schemaMetadonnees>

export function parseMetadonnees(maybeMetadonnees: unknown): MetadonneesDto | NotSupported {
  const result = schemaMetadonnees.safeParse(maybeMetadonnees)
  if (result.error) return toNotSupported('metadonnees', maybeMetadonnees, result.error)
  return result.data
}
