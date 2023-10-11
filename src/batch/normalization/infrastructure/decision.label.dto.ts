import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { hashDecisionId } from '../../../shared/infrastructure/utils/hash.utils'
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
    libelleNatureParticuliere: decision.metadonnees.libelleNature,
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
    appeals: decision.metadonnees.numeroMesureInstruction ?? [],
    blocOccultation: 0,
    chamberId: '',
    chamberName: '',
    dateCreation: TODAY,
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    _id: decision.metadonnees._id,
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: LabelStatus.TOBETREATED,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    public: decision.metadonnees.decisionPublique,
    registerNumber: decision.metadonnees.numeroRegistre,
    sourceId: hashDecisionId(decision.metadonnees._id),
    sourceName: Sources.TJ,
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
    indicateurQPC: decision.metadonnees.indicateurQPC,
    idDecisionWinci: decision.metadonnees.idDecisionWinci
  }
}

function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(4, 6),
    date = dateDecision.substring(6, 8)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
