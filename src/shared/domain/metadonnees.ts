import { Occultation, QualitePartie, TypePartie } from './enums'
import { LabelStatus } from 'dbsder-api-types'

export class President {
  fonction: string
  nom: string
  prenom?: string
  civilite?: string
}

export class DecisionAssociee {
  numeroRegistre: string
  numeroRoleGeneral: string
  idJuridiction: string
  date: string
  idDecisionWinci?: string
}

export class Partie {
  type: TypePartie
  nom: string
  prenom?: string
  civilite?: string
  qualite?: QualitePartie
}

export class Metadonnees {
  nomJuridiction: string
  idJuridiction: string
  codeJuridiction?: string
  numeroRegistre: string
  numeroRoleGeneral: string
  numeroMesureInstruction?: string[]
  codeService: string
  libelleService: string
  dateDecision: string
  codeDecision: string
  libelleCodeDecision: string
  president?: President
  decisionAssociee?: DecisionAssociee
  parties?: Partie[]
  sommaire?: string
  codeNAC: string
  libelleNAC: string
  codeNature: string
  libelleNature: string
  decisionPublique: boolean
  recommandationOccultation: Occultation
  occultationComplementaire?: string
  selection: boolean
  matiereDeterminee: boolean
  pourvoiLocal: boolean
  pourvoiCourDeCassation: boolean
  debatPublic: boolean
  indicateurQPC?: boolean
  idDecisionWinci?: string
}

export class MetadonneesNormalisee extends Metadonnees {
  _id?: string
  labelStatus: LabelStatus
}
