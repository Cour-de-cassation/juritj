import { TypePartie } from '../../domain/enums'

export class MockUtils {
  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom Presidente',
    prenom: 'Prenom Presidente',
    civilite: 'Mme.'
  }

  decisionDtoMock = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20221121',
    numeroMesureInstruction: 'BCDEFGHIJK'
  }

  partieDtoMock = {
    type: TypePartie.PP,
    nom: 'nom Partie'
  }

  metadonneesDtoMock = {
    nomJuridiction: 'Juridictions civiles de première instance',
    idJuridiction: 'TJ75011',
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    numeroMesureInstruction: '0123456789',
    codeService: '0A',
    dateDecision: '20221121',
    libelleService: 'Libelle de service',
    codeDecision: '0aA',
    libelleCodeDecision: 'some libelle code decision',
    decisionAssociee: this.decisionDtoMock,
    parties: [this.partieDtoMock, this.partieDtoMock],
    partie: this.partieDtoMock,
    codeNAC: '88F',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    codeNature: '6C',
    libelleNature: 'Autres demandes en matière de frais et dépens',
    public: false,
    recommandationOccultation: false
  }

  uniqueDecisionId = `TJ75011A01/12345202211210123456789`
  uniqueDecisionIdWithoutNumeroMesureInstruction = `TJ75011A01/1234520221121`
}
