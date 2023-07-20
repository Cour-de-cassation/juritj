import { Occultation, TypePartie } from '../../domain/enums'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types'

export const TODAY = new Date().toISOString()

export class MockUtils {
  // Shared context
  uniqueDecisionId = `TJ75011A01/1234520221121`
  uniqueDecisionIdWithoutNumeroMesureInstruction = `TJ75011A01/1234520221121`

  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom Presidente',
    prenom: 'Prenom Presidente',
    civilite: 'Mme.'
  }

  partieDtoMock = {
    type: TypePartie.PP,
    nom: 'nom Partie'
  }

  decisionContent =
    '\tLe contenu de ma décision avec    des espaces     et des backslash multiples \r\n \t'

  decisionName = 'decisionName.wpd'

  // JuriTJ Collect context
  decisionDtoMock = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20221121'
  }

  mandatoryMetadonneesDtoMock = {
    nomJuridiction: 'Juridictions civiles de première instance',
    idJuridiction: 'TJ75011',
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    codeService: '0A',
    dateDecision: '20221121',
    libelleService: 'Libelle de service',
    codeDecision: '0aA',
    libelleCodeDecision: 'some libelle code decision',
    codeNAC: '88F',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    codeNature: '6C',
    libelleNature: 'Autres demandes en matière de frais et dépens',
    decisionPublique: false,
    recommandationOccultation: Occultation.AUCUNE,
    selection: false,
    matiereDeterminee: true,
    pourvoiLocal: false,
    pourvoiCourDeCassation: false,
    debatPublic: true
  }

  // JuriTJ Normalization context
  allAttributesMetadonneesDtoMock = {
    ...this.mandatoryMetadonneesDtoMock,
    parties: [this.partieDtoMock, this.partieDtoMock],
    id: this.uniqueDecisionId,
    labelStatus: LabelStatus.TOBETREATED,
    numeroMesureInstruction: ['AZERTYUIOP'],
    decisionAssociee: this.decisionDtoMock,
    filenameSource: 'test.wpd'
  }

  toNormalizeDecisionMock = {
    decision: this.decisionContent,
    metadonnees: this.allAttributesMetadonneesDtoMock
  }

  decisionLabelMock: DecisionDTO = {
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: TODAY,
    dateDecision: TODAY,
    jurisdictionCode: 'this.metadonneesDtoMock.codeJuridiction',
    jurisdictionId: this.allAttributesMetadonneesDtoMock.idJuridiction,
    jurisdictionName: this.allAttributesMetadonneesDtoMock.nomJuridiction,
    labelStatus: this.allAttributesMetadonneesDtoMock.labelStatus,
    labelTreatments: null,
    occultation: {
      additionalTerms: 'this.metadonneesDtoMock.occultationComplementaire',
      categoriesToOmit: []
    },
    originalText: this.decisionContent,
    parties: this.allAttributesMetadonneesDtoMock.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    registerNumber: this.allAttributesMetadonneesDtoMock.numeroRegistre,
    solution: null,
    sourceId: null,
    sourceName: null,
    zoning: {
      introduction_subzonage: {
        publication: []
      }
    },
    formation: null,
    blocOccultation: null,
    natureAffaireCivil: this.allAttributesMetadonneesDtoMock.libelleNature,
    natureAffairePenal: null,
    codeMatiereCivil: this.allAttributesMetadonneesDtoMock.codeNature,
    NACCode: this.allAttributesMetadonneesDtoMock.codeNAC,
    endCaseCode: null,
    filenameSource: this.decisionName,
    id: '',
    analysis: {
      analyse: [''],
      doctrine: 'string',
      link: '',
      reference: [],
      source: '',
      summary: '',
      target: '',
      title: []
    },
    decatt: [],
    publication: [],
    NAOCode: ''
  }
}
