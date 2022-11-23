import { TypePartie } from '../controllers/decisions/dto/metadonnees.dto'

export class MockUtils {
  presidentDtoMock = {
    fctPresident: 'president',
    nomPresident: 'Nom President',
    prenomPresident: 'prenom President',
    civilitePresident: 'civilite President'
  }

  decisionDtoMock = {
    numRegistre: 'A',
    numRG: '01/12345',
    juridictionId: 'TJ00000',
    dateDecision: '20221121',
    numMesureInstruction: 'BCDEFGHIJK'
  }

  partieDtoMock = {
    typePartie: TypePartie.PP,
    nomPartie: 'nom Partie'
  }

  metadonneesDtoMock = {
    juridictionName: 'some juridiction name',
    juridictionId: 'TJ00000',
    numRegistre: 'A',
    numRG: '01/12345',
    numMesureInstruction: '0123456789',
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
    recomOccult: false
  }
}
