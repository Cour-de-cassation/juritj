import { ObjectId } from 'mongoose'
import { DecisionModel } from 'src/shared/infrastructure/repositories/decisionModel.schema'

type labelStatusType = 'toBeTreated' | 'loaded' | 'done' | 'exported' | 'blocked'

const labelStatuses = ['toBeTreated', 'loaded', 'done', 'exported', 'blocked'] as labelStatusType[]

export class DecisionLabelDTO {
  _id: ObjectId
  _rev: number
  _version: number
  analysis: {
    analyse: string[]
    doctrine: string
    link: string
    reference: Array<string>
    source: string
    summary: string
    target: string
    title: Array<string>
  }
  appeals: Array<string>
  chamberId: string
  chamberName: string
  dateCreation?: string
  dateDecision?: string
  decatt?: number[]
  jurisdictionCode: string
  jurisdictionId: string
  jurisdictionName: string
  labelStatus: typeof labelStatuses[number]
  labelTreatments: labelTreatmentsType
  locked: boolean
  occultation: {
    additionalTerms: string
    categoriesToOmit: string[]
  }
  originalText: string
  parties: Array<any>
  pseudoStatus: string
  pseudoText: string
  pubCategory: string
  public: boolean | null
  registerNumber: string
  solution: string
  sourceId: number
  sourceName: string
  zoning?: {
    introduction_subzonage: {
      publication: string[]
    }
  }
  publication?: string[]
  formation?: string
  blocOccultation?: number
  natureAffaireCivil?: string
  natureAffairePenal?: string
  codeMatiereCivil?: string
  NACCode?: string
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

export function mapDecisionNormaliseeToLabelDecision(decision: DecisionModel): DecisionLabelDTO {
  return {
    _id: null,
    _rev: null,
    _version: null,
    analysis: null,
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: decision.metadonnees.dateDecision,
    dateDecision: decision.metadonnees.dateDecision,
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: null,
    labelTreatments: null,
    locked: false,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    parties: decision.metadonnees.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    public: decision.metadonnees.public,
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: null,
    sourceId: null,
    sourceName: null,
    zoning: {
      introduction_subzonage: {
        publication: []
      }
    },
    publication: [],
    formation: null,
    blocOccultation: null,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: null,
    codeMatiereCivil: decision.metadonnees.codeNature,
    NACCode: decision.metadonnees.codeNAC,
    endCaseCode: null
  }
}
