import { LabelStatus, TypePartie } from '../../domain/enums'

export class MockUtils {
  uniqueDecisionId = `TJ75011A01/1234520221121`
  uniqueDecisionIdWithoutNumeroMesureInstruction = `TJ75011A01/1234520221121`

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

  mockDate = new Date().toISOString()
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
    decisionAssociee: this.decisionDtoMock,
    parties: [this.partieDtoMock, this.partieDtoMock],
    codeNAC: '88F',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    codeNature: '6C',
    libelleNature: 'Autres demandes en matière de frais et dépens',
    public: false,
    recommandationOccultation: false
  }

  allAttributesMetadonneesDtoMock = {
    ...this.mandatoryMetadonneesDtoMock,
    idDecision: this.uniqueDecisionId,
    labelStatus: LabelStatus.TOBETREATED,
    numeroMesureInstruction: ['AZERTYUIOP']
  }

  decisionContent =
    '\tLe contenu de ma décision avec    des espaces     et des backslash multiples \r\n \t'

  dbSderDecisionMock = {
    decision: this.decisionContent,
    metadonnees: this.allAttributesMetadonneesDtoMock
  }
  decisionLabelMock = {
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: new Date().toISOString(),
    dateDecision: new Date().toISOString(),
    jurisdictionCode: 'this.metadonneesDtoMock.codeJuridiction',
    jurisdictionId: this.allAttributesMetadonneesDtoMock.idJuridiction,
    jurisdictionName: this.allAttributesMetadonneesDtoMock.nomJuridiction,
    labelStatus: this.allAttributesMetadonneesDtoMock.labelStatus,
    labelTreatments: null,
    occultation: {
      additionalTerms: 'this.metadonneesDtoMock.occultationComplementaire',
      categoriesToOmit: []
    },
    originalText: this.dbSderDecisionMock.decision,
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
    endCaseCode: null
  }
}
