import { TypePartie } from '../../domain/enums'

export class MockUtils {
  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom President',
    prenom: 'prenom President',
    civilite: 'civilite President'
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
    nomJuridiction: 'some juridiction name',
    idJuridiction: 'TJ75011',
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    numeroMesureInstruction: '0123456789',
    codeService: '0A',
    dateDecision: '20221121',
    libelleService: 'some libelle',
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
