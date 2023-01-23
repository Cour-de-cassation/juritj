import { Decision, Partie, President } from './metadonnees'

export class Decisions {
  decision: string
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
