import { ObjectId } from 'mongoose'
import { LabelStatus } from 'src/shared/domain/enums'
import { DecisionModel } from 'src/shared/infrastructure/repositories/decisionModel.schema'

/** Etapes : 
 1. Pour chaque champ, 2 questions à se poser : sa description (qu'est-ce que ça represente ?)
et sa pertinence pour JuriTJ (Dans le cadre JuriTJ, Quelle est son utilité?)
 1b. Y indiquer le champ MetadonneesDTO equivalent
 2. Manque-t-il des champs juriTJ ? Faut-il les rajouter au process Label ? Description, pertinence
 3. Les champs restant :  delete ?

 Remarque  : Les Pas utilisé sont dans le scope Label. On sait pas si c'est utilisé autre part ( Cf Sebastien)
*/

export class DecisionLabelDTO {
  /**
   * idMongo , Pas utilisé(cf Sebastien)
   */
  _id: ObjectId

  /**
   * pas utilisé (cf Sebastien)
   */
  _rev: number

  /**
   * Pas Utilisé (cf Sebastien)
   */
  _version: number

  /**
   * Pas utilisé par Label (cf Sebastien)
   */
  analysis: {
    analyse: string[] //
    doctrine: string //
    link: string //
    reference: Array<string> //
    source: string //
    summary: string //
    target: string //
    title: Array<string> //
  }

  /**
   * Pas utilisé par Label (cf Sebastien)
   */
  appeals: Array<string>

  /**
   *  utilisé par Label
   * (composante de chamberName afin de pouvoir etre lisible pour les agents,
   *  utilisé pour les circuits de relecture)
   */
  chamberId: string

  /**
   * utilisé par Label
   * (ex à la Cour de cassation, en fonction du niveau de l'affaire ou du thème : 'Chambre sociale',
   *  'Chambre commerciale', 'Saisine pour avis', 'Assemblée plénière',
   *  'Tribunal des conflit' = lorsque l'affaire est entre le juridicitionnel et l'administratif)
   */
  chamberName: string

  /**
   * "date d'import" = date de réception de la part de winciTGI
   */
  dateCreation?: string

  /**
   * quand la décision est rendue = metadonnees.dateDecision
   */
  dateDecision?: string

  /**
   * "Décision(s) attaquée(s)" (pour l'instant/dette technique) utilisé par Label pour le chainage,
   * c'est quand on a une décision de la Cour de cassation qui attaque une décision de cour d'appel ->
   *  on va plus l'utilisé et on va passer sur la table Affaires (judilibre-index)
   * A discuter lors de sujet Chainage
   */
  decatt?: number[]

  /**
   * Pas utilisé par Label
   */
  jurisdictionCode: string

  /**
   * Pas utilisé par Label
   */
  jurisdictionId: string

  /**
   * Comme la chambre : le titre pour l'UI Label
   * (ex: 'Cour de cassation', 'Cour d'appel d'Angers', 'Tribunal judiciaire de Bobigny')
   * + circuit de relecture
   */
  jurisdictionName: string

  /**
   * 'toBeTreated', 'loaded', 'done', 'exported',
   * 'blocked' = pas une décision (qu'on doit traiter car ancien ou autre document)
   */
  labelStatus: LabelStatus

  /**
   * Tableau rempli par Label lors de l'export de Label (passe au labelStatus done)
   */
  labelTreatments: labelTreatmentsType

  /**
   * Pas utilisé par Label
   */
  locked: boolean

  /**
   * Demandes d'occultation (instructions)
   */
  occultation: {
    /**
     * Demandes d'occultation supplémentaires
     * (liste de mots qui est présent dans le texte de la décision,
     *  renseigné à la main par les greffiers dans WinciTGI/Nomos/WinciCA, séparés par des slashs,
     *  ex: "Entreprise Dupont / Entreprise Dupond")
     */
    additionalTerms: string

    /**
     * Catégorie d'occultation à ne pas traiter
     * (c'est une logique inversée : https://trello.com/c/JbujUt6o/276-changer-categoriestoomit-%C3%A0-categoriestoinclude)
     */
    categoriesToOmit: string[]
  }

  /**
   * Texte de la decision
   */
  originalText: string

  /**
   * Les parties,
   * utilisé par le moteur d'annotation pour détecter les avocats qui ne doivent pas être en personnes physiques
   * /!\ any : tableau structuré avec ID, type = "avocat" et plein d'autres (à voir à Sébastien)
   */
  parties: Array<any>

  /**
   * N'est pas présent dans la base SDER, donc le schéma est probablement faux sur ce champ
   */
  pseudoStatus: string

  /**
   * Texte pseudonymisé (publié sur Judilibre)
   */
  pseudoText: string

  /**
   * Catégorie de diffusion, hérité de la Cour de cassation,
   * Utilisé pour l'UI Label + circuit de relecture + priorisation (publication à 14h) ;
   * 'B' = publié au Bulletin Cour de cassation, 'R' = publié au Rapport Cour de cassation,
   * 'L', 'C', 'W' = toutes les décisions CA, probablement toutes les décisions de TJ pareil
   */
  pubCategory: string

  /**
   * Pas utilisé par Label (cf Sebastien)
   */
  public: boolean | null

  /**
   * Pas utilisé par Label (cf Sebastien)
   */
  registerNumber: string

  /**
   * circuit de relecture pour jurinet
   * ex: 'Avis sur saisine', 'Non-admission', 'Déchéance',
   * 'Déchéance par ordonnance', 'Désistement', 'Désistement par arrêt'
   */
  solution: string

  /**
   * ID de la décision (ID Oracle) utilisé fréquemment dans Label
   * DL : ( c'est cet ID là que j'écris à la main quand j'import manuellement une décision)
   */
  sourceId: number

  /**
   * 'jurica', 'jurinet', 'juritj'
   */
  sourceName: string

  /**
   * (zonage) Pas utilisé par Label mais affiché sur le site de la cour de cassation
   * (mise en page) + décisions diffusées par extrait
   */
  zoning?: {
    introduction_subzonage: {
      publication: string[]
    }
  }

  /**
   * Probablement dupliqué pubCategory (il peut y avoir plusieurs lettres), merge dans Label
   */
  publication?: string[]

  /**
   * Champ session dans Label
   * circuit de relecture, pour la Cour de cassation ex: "FRR" formation restreinte
   */
  formation?: string

  /**
   * Pas utilisé dans Label
   * catégorie pour l'occultation 1, 2, 3, 4 (1 = peu sensible, 4 = très sensible)
   */
  blocOccultation?: number

  /**
   * Cour de cassation : circuit de relecture
   */
  natureAffaireCivil?: string

  /**
   * Cour de cassation : circuit de relecture
   */
  natureAffairePenal?: string

  /**
   * Cour de cassation : circuit de relecture
   */
  codeMatiereCivil?: string

  /**
   * Cour d'appel : circuit de relecture (on n'enregistre pas le libellé du code NAC, c'est inutile)
   */
  NACCode?: string

  /**
   * Cour d'appel : circuit de relecture
   */
  endCaseCode?: string

  /** Dans le Futur
   * NAOCode?: string Cour de cassation : circuit de relecture (remplace les codeMatiereCivil)
   *
   */
}

type labelTreatmentsType = Array<{
  annotations: Array<{
    category: string
    entityId: string
    start: number
    text: string
  }>
  source: string
  order: number
}>

export function mapDecisionNormaliseeToLabelDecision(decision: DecisionModel): DecisionLabelDTO {
  return {
    _id: null,
    _rev: null,
    _version: null,
    analysis: null,
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: decision.metadonnees.dateDecision,
    dateDecision: decision.metadonnees.dateDecision,
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: decision.metadonnees.labelStatus,
    labelTreatments: null,
    locked: false,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    parties: decision.metadonnees.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    public: decision.metadonnees.public,
    registerNumber: decision.metadonnees.numeroRegistre,
    solution: null,
    sourceId: null,
    sourceName: null,
    zoning: {
      introduction_subzonage: {
        publication: []
      }
    },
    publication: [],
    formation: null,
    blocOccultation: null,
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: null,
    codeMatiereCivil: decision.metadonnees.codeNature,
    NACCode: decision.metadonnees.codeNAC,
    endCaseCode: null
  }
}
