import { z } from 'zod'
import { ValidationError } from '../error'

export enum SuiviOccultation {
  AUCUNE = 'aucune',
  CONFORME = 'conforme',
  SUBSTITUANT = 'substituant',
  COMPLEMENT = 'complément'
}

export enum QualitePartieExhaustive {
  F = 'F',
  G = 'G',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N'
}

export enum TypePartieExhaustive {
  PP = 'PP',
  PM = 'PM',
  AA = 'AA',
  NA = 'NA'
}

const PresidentSchema = z.object({
  fonction: z.string(),
  nom: z.string(),
  prenom: z.string(),
  civilite: z.string().optional()
})

const DecisionAssocieeSchema = z.object({
  numeroRegistre: z.string().length(1),
  numeroRoleGeneral: z.string().regex(/^[0-9]{2}\/[0-9]{5}$/),
  idJuridiction: z.string().regex(/^TJ[0-9A-Z]{5}$/),
  date: z.string().regex(/^[0-9]{8}$/),
  idDecision: z.string().optional()
})

const PartieSchema = z.object({
  type: z.nativeEnum(TypePartieExhaustive),
  nom: z.string(),
  prenom: z.string().optional(),
  civilite: z.string().optional(),
  qualite: z.nativeEnum(QualitePartieExhaustive).optional()
})

export const MetadonneesSchema = z.object({
  nomJuridiction: z.string().min(2).max(42),
  idJuridiction: z.string().regex(/^TJ[0-9A-Z]{5}$/),
  codeJuridiction: z.string().optional(),
  numeroRegistre: z.string().length(1),
  numeroRoleGeneral: z.string().regex(/^[0-9]{2}\/[0-9]{5}$/),
  numeroMesureInstruction: z.array(z.string().length(10)).optional(),
  codeService: z.string().regex(/^.{2}$/),
  libelleService: z.string().max(25),
  dateDecision: z.string().regex(/^[0-9]{8}$/),
  codeDecision: z.string().regex(/^[0-9a-zA-Z]{3}$/),
  libelleCodeDecision: z.string().max(200),
  president: PresidentSchema.optional(),
  decisionAssociee: DecisionAssocieeSchema.optional(),
  parties: z.array(PartieSchema).optional(),
  sommaire: z.string().optional(),
  codeNAC: z.string().regex(/^[0-9a-zA-Z]{3}$/),
  libelleNAC: z.string(),
  codeNature: z
    .string()
    .regex(/^[0-9a-zA-Z ]{0,2}$/)
    .optional(),
  libelleNature: z.string().optional(),
  decisionPublique: z.boolean(),
  recommandationOccultation: z.nativeEnum(SuiviOccultation),
  occultationComplementaire: z.string().optional(),
  selection: z.boolean(),
  matiereDeterminee: z.boolean(),
  pourvoiLocal: z.boolean(),
  pourvoiCourDeCassation: z.boolean(),
  debatPublic: z.boolean(),
  idDecision: z.string().optional(),
  indicateurQPC: z.boolean().optional()
})

export type Metadonnees = z.infer<typeof MetadonneesSchema>
export type President = z.infer<typeof PresidentSchema>
export type DecisionAssociee = z.infer<typeof DecisionAssocieeSchema>
export type Partie = z.infer<typeof PartieSchema>

export function parseMetadonnees(x: unknown): Metadonnees {
  const result = MetadonneesSchema.safeParse(x)
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message
    }))
    throw new ValidationError('Les métadonnées ne sont pas valides', errors)
  }
  return result.data
}
