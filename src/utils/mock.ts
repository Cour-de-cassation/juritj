import { Metadonnees, SuiviOccultation, TypePartieExhaustive } from '../services/decisions/models'

export class MockUtils {
  uniqueDecisionId = `TJ75011A01-1234520240120`
  uniqueDecisionIdHash = 2276616178

  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom Presidente',
    prenom: 'Prenom Presidente',
    civilite: 'Mme.'
  }

  partieDtoMock = {
    type: TypePartieExhaustive.PP,
    nom: 'nom Partie'
  }

  decisionContentToNormalize =
    '\tLe contenu de ma décision avec\n    des espaces     et des backslash multiples \r\n \t'
  decisionContentNormalized =
    'Le contenu de ma décision avec\n des espaces et des backslash multiples'

  decisionName = 'decisionName.wpd'

  dateNow = new Date(2023, 12, 20)

  decisionAssocieeDtoMock = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20240120',
    idDecision: 'TJ00001'
  }

  mandatoryMetadonneesDtoMock: Metadonnees = {
    nomJuridiction: 'Juridictions civiles de première instance',
    idJuridiction: 'TJ75011',
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    codeService: '0A',
    dateDecision: '20240120',
    libelleService: 'Libelle de service',
    codeDecision: '55C',
    libelleCodeDecision: 'some libelle code decision / endCaseCode',
    codeNAC: '11F',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    decisionPublique: true,
    recommandationOccultation: SuiviOccultation.SUBSTITUANT,
    occultationComplementaire: 'occultation complementaire',
    selection: false,
    matiereDeterminee: true,
    pourvoiLocal: false,
    pourvoiCourDeCassation: false,
    debatPublic: true
  }
}
