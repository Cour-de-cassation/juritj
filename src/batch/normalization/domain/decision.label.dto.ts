import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { TODAY } from '../../../shared/infrastructure/utils/mock.utils'

export class DecisionAnalyse {
  analyse: string[]

  doctrine: string

  link: string

  reference: string[]

  source: string

  summary: string

  target: string

  title: string[]
}

export class DecisionLabelDTO {
  // publication, formation, blocOccultation, natureAffairePenal.
  id: string

  analysis: DecisionAnalyse

  appeals: Array<string>

  chamberId: string

  chamberName: string

  dateCreation?: string

  dateDecision?: string

  iddecision: string

  decatt: number[]

  jurisdictionCode: string

  jurisdictionId: string

  jurisdictionName: string

  labelStatus: LabelStatus

  labelTreatments: labelTreatmentsType

  occultation: {
    additionalTerms: string
    categoriesToOmit: string[]
  }

  originalText: string

  parties: Array<any>

  pseudoStatus: string

  pseudoText: string

  pubCategory: string

  publication: string[]

  registerNumber: string

  solution: string

  sourceId: number

  sourceName: string

  zoning?: {
    introduction_subzonage: {
      publication: string[]
    }
  }

  formation: string

  blocOccultation: number

  natureAffaireCivil?: string

  natureAffairePenal: string

  codeMatiereCivil?: string

  NAOCode: string

  NACCode?: string

  endCaseCode?: string

  filenameSource: string
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

export function mapDecisionNormaliseeToLabelDecision(
  decision: DecisionModel,
  decisionName: string
): DecisionLabelDTO {
  return {
    publication: [],
    analysis: {
      analyse: [''],
      doctrine: '',
      link: '',
      reference: [],
      source: '',
      summary: '',
      target: '',
      title: ['test']
    },
    id: 'someId',
    decatt: [1],
    appeals: [],
    iddecision: 'test',
    NAOCode: 'NaoCode',
    chamberId: 'null',
    chamberName: 'null',
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
    solution: 'null',
    sourceId: 0,
    sourceName: 'juriTJ',
    zoning: {
      introduction_subzonage: {
        publication: []
      }
    },
    formation: 'null',
    blocOccultation: 0,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: 'null',
    codeMatiereCivil: decision.metadonnees.codeNature,
    NACCode: decision.metadonnees.codeNAC,
    endCaseCode: null,
    filenameSource: decisionName
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
