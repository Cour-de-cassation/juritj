import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { TODAY } from '../../../shared/infrastructure/utils/mock.utils'
import { LabelStatus, Sources, TypePartie, DecisionTJDTO } from 'dbsder-api-types'

export function mapDecisionNormaliseeToLabelDecision(
  decision: DecisionModel,
  decisionName: string
): DecisionTJDTO {
  return {
    codeDecision: decision.metadonnees.codeDecision,
    codeNature: decision.metadonnees.codeNature,
    codeService: decision.metadonnees.codeService,
    debatPublic: decision.metadonnees.debatPublic,
    decisionAssociee: decision.metadonnees.decisionAssociee,
    libelleCodeDecision: decision.metadonnees.libelleCodeDecision,
    libelleNAC: decision.metadonnees.libelleNAC,
    libelleNature: decision.metadonnees.libelleNature,
    libelleService: decision.metadonnees.libelleService,
    matiereDeterminee: decision.metadonnees.matiereDeterminee,
    numeroRoleGeneral: decision.metadonnees.numeroRoleGeneral,
    pourvoiCourDeCassation: decision.metadonnees.pourvoiCourDeCassation,
    pourvoiLocal: decision.metadonnees.pourvoiLocal,
    president: decision.metadonnees.president,
    recommandationOccultation: decision.metadonnees.recommandationOccultation,
    selection: decision.metadonnees.selection,
    sommaire: decision.metadonnees.sommaire,
    NACCode: decision.metadonnees.codeNAC,
    NAOCode: '',
    NPCode: '',
    analysis: {
      analyse: [],
      doctrine: '',
      link: '',
      reference: [],
      source: '',
      summary: '',
      target: '',
      title: []
    },
    appeals: decision.metadonnees.numeroMesureInstruction ?? [],
    blocOccultation: 0,
    chamberId: 'null',
    chamberName: 'null',
    codeMatiereCivil: '',
    dateCreation: TODAY,
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    decatt: [1],
    endCaseCode: '',
    formation: '',
    _id: decision.metadonnees._id,
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: LabelStatus.TOBETREATED,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: 'null',
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    pseudoStatus: '',
    pseudoText: '',
    public: decision.metadonnees.decisionPublique,
    publication: [],
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: '',
    sourceId: 0,
    sourceName: Sources.TJ,
    zoning: undefined,
    filenameSource: decisionName,
    parties: [
      {
        nom: 'nom Partie',
        type: TypePartie.PP
      },
      {
        nom: 'nom Partie',
        type: TypePartie.PP
      }
    ],
    labelTreatments: null,
    pubCategory: null
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
