import {
  DecisionDTO,
  DecisionTJDTO,
  LabelStatus,
  Sources,
  Occultation,
  TypePartie
} from 'dbsder-api-types'

export class MockUtils {
  // Shared context
  uniqueDecisionId = `TJ75011A01-1234520221121`
  uniqueDecisionIdHash = 1616441172

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

  decisionContentToNormalize =
    '\tLe contenu de ma décision avec    des espaces     et des backslash multiples \r\n \t'
  decisionContentNormalized =
    'Le contenu de ma décision avec des espaces et des backslash multiples \n '

  decisionName = 'decisionName.wpd'

  dateNow = new Date(2022, 10, 21)

  // JuriTJ Collect context
  decisionAssocieeDtoMock = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20221121',
    idDecision: 'TJ00001'
  }

  mandatoryMetadonneesDtoMock = {
    nomJuridiction: 'Juridictions civiles de première instance',
    idJuridiction: 'TJ75011',
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    codeService: '0A',
    dateDecision: '20221121',
    libelleService: 'Libelle de service',
    codeDecision: '55C',
    libelleCodeDecision: 'some libelle code decision',
    codeNAC: '11F',
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    codeNature: '6C',
    libelleNature: 'Autres demandes en matière de frais et dépens',
    decisionPublique: true,
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
    _id: this.uniqueDecisionId,
    labelStatus: LabelStatus.TOBETREATED,
    numeroMesureInstruction: ['AZERTYUIOP'],
    decisionAssociee: this.decisionAssocieeDtoMock,
    filenameSource: this.decisionName,
    indicateurQPC: true,
    idDecision: 'TJ00000',
    sourceId: this.uniqueDecisionIdHash
  }

  toNormalizeDecisionMock = {
    decision: this.decisionContentToNormalize,
    metadonnees: this.allAttributesMetadonneesDtoMock
  }

  // End of normalization context
  decisionMock: DecisionDTO = {
    appeals: this.allAttributesMetadonneesDtoMock.numeroMesureInstruction,
    chamberId: '',
    chamberName: '',
    dateCreation: this.dateNow.toISOString(),
    dateDecision: this.dateNow.toISOString(),
    jurisdictionCode: undefined,
    jurisdictionId: this.allAttributesMetadonneesDtoMock.idJuridiction,
    jurisdictionName: this.allAttributesMetadonneesDtoMock.nomJuridiction,
    labelStatus: this.allAttributesMetadonneesDtoMock.labelStatus,
    occultation: {
      additionalTerms: '',
      categoriesToOmit: []
    },
    originalText: this.decisionContentNormalized,
    parties: this.allAttributesMetadonneesDtoMock.parties,
    registerNumber: this.allAttributesMetadonneesDtoMock.numeroRegistre,
    sourceId: this.uniqueDecisionIdHash,
    sourceName: Sources.TJ,
    blocOccultation: 0,
    NPCode: this.allAttributesMetadonneesDtoMock.codeNature,
    NACCode: this.allAttributesMetadonneesDtoMock.codeNAC,
    filenameSource: this.allAttributesMetadonneesDtoMock.filenameSource,
    public: this.allAttributesMetadonneesDtoMock.decisionPublique
  }

  decisionAssocieeTJDtoMock = {
    numeroRegistre: this.decisionAssocieeDtoMock.numeroRegistre,
    numeroRoleGeneral: this.decisionAssocieeDtoMock.numeroRoleGeneral,
    idJuridiction: this.decisionAssocieeDtoMock.idJuridiction,
    date: this.decisionAssocieeDtoMock.date,
    idDecisionWinci: this.decisionAssocieeDtoMock.idDecision
  }

  decisionTJMock: DecisionTJDTO = {
    ...this.decisionMock,
    decisionAssociee: this.decisionAssocieeTJDtoMock,
    indicateurQPC: true,
    idDecisionWinci: this.allAttributesMetadonneesDtoMock.idDecision,
    codeDecision: this.allAttributesMetadonneesDtoMock.codeDecision,
    codeService: this.allAttributesMetadonneesDtoMock.codeService,
    debatPublic: this.allAttributesMetadonneesDtoMock.debatPublic,
    libelleCodeDecision: this.allAttributesMetadonneesDtoMock.libelleCodeDecision,
    libelleNAC: this.allAttributesMetadonneesDtoMock.libelleNAC,
    libelleNatureParticuliere: this.allAttributesMetadonneesDtoMock.libelleNature,
    libelleService: this.allAttributesMetadonneesDtoMock.libelleService,
    matiereDeterminee: this.allAttributesMetadonneesDtoMock.matiereDeterminee,
    numeroRoleGeneral: this.allAttributesMetadonneesDtoMock.numeroRoleGeneral,
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: Occultation.AUCUNE,
    president: undefined,
    sommaire: undefined,
    selection: false,
    idDecisionTJ: this.uniqueDecisionId
  }
}
