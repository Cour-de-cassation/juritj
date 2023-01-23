import { QualitePartie, TypePartie } from './enums'

export class President {
  fonction: string
  nom: string
  prenom: string
  civilite: string
}

export class Decision {
  numeroRegistre: string
  numeroRoleGeneral: string
  idJuridiction: string
  date: string
  numeroMesureInstruction: string
}

export class Partie {
  type: TypePartie
  nom: string
  prenom?: string
  civilite?: string
  qualite?: QualitePartie
}

export class Metadonnees {
  idDecision?: string
  nomJuridiction: string
  idJuridiction: string
  codeJuridiction?: string
  numeroRegistre: string
  numeroRoleGeneral: string
  numeroMesureInstruction: string
  codeService: string
  libelleService: string
  dateDecision: string
  codeDecision: string
  libelleCodeDecision: string
  president?: President
  chainage?: Decision[]
  decisionAssociee: Decision
  parties: Partie[]
  partie: Partie
  sommaire?: string
  codeNAC: string
  libelleNAC: string
  codeNature: string
  libelleNature: string
  public: boolean
  recommandationOccultation: boolean
  occultationComplementaire?: string
}
