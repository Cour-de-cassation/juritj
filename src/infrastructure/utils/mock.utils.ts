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
    codeNAC: '0aA',
    libelleNAC: 'some libelle NAC',
    codeNature: '0a',
    libelleNature: 'libelle',
    public: false,
    recommandationOccultation: false
  }
}
