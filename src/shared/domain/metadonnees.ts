import { LabelStatus, Occultation, QualitePartie, TypePartie } from './enums'

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
}

export class MetadonneesNormalisee extends Metadonnees {
  idDecision: string
  labelStatus: LabelStatus
}
