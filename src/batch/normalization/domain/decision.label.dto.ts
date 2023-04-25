import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { TODAY } from '../../../shared/infrastructure/utils/mock.utils'

@Schema()
export class DecisionLabelDTO {
  @Prop()
  appeals: Array<string>

  @Prop()
  chamberId: string

  @Prop()
  chamberName: string

  @Prop()
  dateCreation?: string

  @Prop()
  dateDecision?: string

  @Prop()
  jurisdictionCode: string

  @Prop()
  jurisdictionId: string

  @Prop()
  jurisdictionName: string

  @Prop()
  labelStatus: LabelStatus

  @Prop()
  labelTreatments: labelTreatmentsType

  @Prop(
    raw({
      additionalTerms: { type: String },
      categoriesToOmit: [{ type: String }]
    })
  )
  occultation: {
    additionalTerms: string
    categoriesToOmit: string[]
  }

  @Prop()
  originalText: string

  @Prop()
  parties: Array<any>

  @Prop()
  pseudoStatus: string

  @Prop()
  pseudoText: string

  @Prop()
  pubCategory: string

  @Prop()
  registerNumber: string

  @Prop()
  solution: string

  @Prop()
  sourceId: number

  @Prop()
  sourceName: string

  @Prop(
    raw({
      introduction_subzonage: { type: Object }
    })
  )
  zoning?: {
    introduction_subzonage: {
      publication: string[]
    }
  }

  @Prop()
  formation?: string

  @Prop()
  blocOccultation?: number

  @Prop()
  natureAffaireCivil?: string

  @Prop()
  natureAffairePenal?: string

  @Prop()
  codeMatiereCivil?: string

  @Prop()
  NACCode?: string

  @Prop()
  endCaseCode?: string
}

type labelTreatmentsType = Array<{
  annotations: Array<{
    category: string
    entityId: string
    start: number
    text: string
  }>
  source: string
  order: number
}>

export const DecisionSchema = SchemaFactory.createForClass(DecisionLabelDTO)

export function mapDecisionNormaliseeToLabelDecision(decision: DecisionModel): DecisionLabelDTO {
  return {
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: TODAY,
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: decision.metadonnees.labelStatus,
    labelTreatments: null,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    parties: decision.metadonnees.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: null,
    sourceId: null,
    sourceName: null,
    zoning: {
      introduction_subzonage: {
        publication: []
      }
    },
    formation: null,
    blocOccultation: null,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: null,
    codeMatiereCivil: decision.metadonnees.codeNature,
    NACCode: decision.metadonnees.codeNAC,
    endCaseCode: null
  }
}

function parseDate(dateDecision: string) {
  const y = dateDecision.substring(0, 4),
    m = dateDecision.substring(4, 6),
    d = dateDecision.substring(6, 8)
  return new Date(parseInt(y), parseInt(m), parseInt(d))
}
