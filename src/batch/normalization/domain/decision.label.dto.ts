import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'

@Schema()
export class DecisionLabelDTO {
  /**
   * idMongo , Pas utilisé(cf Sebastien)
   * Sébastien : L'id MongoDB de la décision (ObjectId) est utilisé afin de générer
   * l'id de celle-ci dans Judilibre (string).
   */
  //_id: ObjectId

  /**
   * pas utilisé (cf Sebastien)
   * Sébastien : Initialement prévu pour stocker le nombre de révisions successives de la décision,
   * au final pas utilisé.
   */
  //_rev: number

  /**
   * Pas Utilisé (cf Sebastien)
   * Sébastien : Initialement prévu pour stocker le numéro de version du modèle de document,
   * afin de gérer finement d'éventuelles mises à jour de documents déjà publiés suite à des
   * évolutions du modèle, au final pas utilisé.
   */
  //_version: number

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Groupe de métadonnées utilisées en partie pour la publication dans Judilibre
   */
  // analysis: {
  //   analyse: string[] // Eléments de titrage et d'analyse complémentaires, non utilisé pour l'instant
  //                     // (CC seulement)
  //   //doctrine: string // Non utilisé
  //   link: string  // Rapprochements de jurisprudence = références textuelles vers d'autres décisions de CC
  //                 // (enrichissement saisi manuellement en amont, la plupart du temps postérieurement
  //                 // à la publication - CC seulement)
  //   reference: Array<string>  // Eléments de titrage et d'analyse complémentaires, non utilisé pour l'instant
  //                             // (CC seulement)
  //   source: string  // Non utilisé
  //   summary: string   // Résumé de la décision (enrichissement saisi manuellement en amont,
  //                     // la plupart du temps postérieurement à la publication - CC seulement)
  //   target: string  // Texte(s) visé(s) (enrichissement saisi manuellement en amont,
  //                   // la plupart du temps postérieurement à la publication - CC seulement)
  //   title: Array<string>  // Eléments de titrage (enrichissement saisi manuellement en amont,
  //                         // la plupart du temps postérieurement à la publication - CC seulement)
  // }

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Numéro(s) de pourvoi de la décision
   * TODO : on a pas cette valeur coté JuriTJ
   */
  @Prop()
  appeals: Array<string>

  /**
   *  utilisé par Label
   * (composante de chamberName afin de pouvoir etre lisible pour les agents,
   *  utilisé pour les circuits de relecture)
   * TODO : on a pas cette valeur coté JuriTJ
   */
  @Prop()
  chamberId: string

  /**
   * utilisé par Label
   * (ex à la Cour de cassation, en fonction du niveau de l'affaire ou du thème : 'Chambre sociale',
   *  'Chambre commerciale', 'Saisine pour avis', 'Assemblée plénière',
   *  'Tribunal des conflit' = lorsque l'affaire est entre le juridicitionnel et l'administratif)
   * TODO : on a pas cette valeur coté JuriTJ
   */
  @Prop()
  chamberName: string

  /**
   * "date d'import" = date de réception de la part de winciTGI
   * TODO : a rajouter dans le DTO initial (date d'arrivée sur JuriTJCollecte)
   */
  @Prop()
  dateCreation?: string

  /**
   * quand la décision est rendue = metadonnees.dateDecision
   */
  @Prop()
  dateDecision?: string

  /**
   * "Décision(s) attaquée(s)" (pour l'instant/dette technique) utilisé par Label pour le chainage,
   * c'est quand on a une décision de la Cour de cassation qui attaque une décision de cour d'appel ->
   *  on va plus l'utilisé et on va passer sur la table Affaires (judilibre-index)
   * A discuter lors de sujet Chainage
   * Sébastien : vaut uniquement pour CC, substitution en place via une API de l'Index (cf. https://github.com/Cour-de-cassation/openjustice-sder/blob/master/doc/chainage.md)
   */
  // decatt?: number[]

  /**
   * Pas utilisé par Label
   * Sébastien : jurisdictionCode et jurisdictionId conservent les différentes manières
   * (plus ou moins homogènes) de codifier et/ou identifier la juridiction émettrice.
   * Utilisé (comme on peut) dans Judilibre.
   * TODO : metadonnees.codeJuridiction
   */
  @Prop()
  jurisdictionCode: string

  /**
   * Pas utilisé par Label
   * Cf. jurisdictionCode.
   * TODO : metadonnees.idJuridiction
   */
  @Prop()
  jurisdictionId: string

  /**
   * Comme la chambre : le titre pour l'UI Label
   * (ex: 'Cour de cassation', 'Cour d'appel d'Angers', 'Tribunal judiciaire de Bobigny')
   * + circuit de relecture
   * TODO : metadonnees.nomJuridiction
   */
  @Prop()
  jurisdictionName: string

  /**
   * 'toBeTreated', 'loaded', 'done', 'exported',
   * 'blocked' = pas une décision (qu'on doit traiter car ancien ou autre document)
   */
  @Prop()
  labelStatus: LabelStatus

  /**
   * Tableau rempli par Label lors de l'export de Label (passe au labelStatus done)
   * TODO : vide pour JuriTJ Collecte et normalisation
   */
  @Prop()
  labelTreatments: labelTreatmentsType

  /**
   * Pas utilisé par Label
   * Sébastien : Initialement prévu pour permettre de bloquer les traitemens sur une décision,
   * au final pas utilisé.
   */
  //locked: boolean

  /**
   * Demandes d'occultation (instructions)
   */
  @Prop(
    raw({
      additionalTerms: { type: String },
      categoriesToOmit: [{ type: String }]
    })
  )
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
   *
   * TODO : decisionIntegre
   */
  @Prop()
  originalText: string

  /**
   * Les parties,
   * utilisé par le moteur d'annotation pour détecter les avocats qui ne doivent pas être en personnes physiques
   * /!\ any : tableau structuré avec ID, type = "avocat" et plein d'autres (à voir à Sébastien)
   */
  @Prop()
  parties: Array<any>

  /**
   * N'est pas présent dans la base SDER, donc le schéma est probablement faux sur ce champ
   * Sébastien : reprend en fait le statut de pseudonymisation initialisé
   * qui est utilisé en amont (dans les bases Oracle = champ IND_ANO) :
   *  - 0 : à traiter
   *  - 1 : en cours
   *  - 2 : traité
   *  - 4 : en erreur
   *
   * TODO : soit c'est a 0 soit on y touche pas
   */
  @Prop()
  pseudoStatus: string

  /**
   * Texte pseudonymisé (publié sur Judilibre)
   *
   * TODO : vide a l'instant de la normalisation
   */
  @Prop()
  pseudoText: string

  /**
   * Catégorie de diffusion, hérité de la Cour de cassation,
   * Utilisé pour l'UI Label + circuit de relecture + priorisation (publication à 14h) ;
   * 'B' = publié au Bulletin Cour de cassation, 'R' = publié au Rapport Cour de cassation,
   * 'L', 'C', 'W' = toutes les décisions CA, probablement toutes les décisions de TJ pareil
   *
   * TODO : Par defaut : W à voir si besoin de plus d'info
   */
  @Prop()
  pubCategory: string

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Sébastien : CA seulement, reprend et convertit en booléen la valeur de l'indicateur original JDEC_IND_DEC_PUB
   */
  //public: boolean | null

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Sébastien : numéro de la décision "au registre" (dépend de la source, dans sa signification
   * comme dans son utilisation pour la publication)
   *
   * TODO : numeroRegistre
   */
  @Prop()
  registerNumber: string

  /**
   * circuit de relecture pour jurinet
   * ex: 'Avis sur saisine', 'Non-admission', 'Déchéance',
   * 'Déchéance par ordonnance', 'Désistement', 'Désistement par arrêt'
   */
  @Prop()
  solution: string

  /**
   * ID de la décision (ID Oracle) utilisé fréquemment dans Label
   * DL : ( c'est cet ID là que j'écris à la main quand j'import manuellement une décision)
   */
  @Prop()
  sourceId: number

  /**
   * 'jurica', 'jurinet', 'juritj'
   *
   * TODO :  par defaut juritj
   */
  @Prop()
  sourceName: string

  /**
   * (zonage) Pas utilisé par Label mais affiché sur le site de la cour de cassation
   * (mise en page) + décisions diffusées par extrait
   *
   * TODO : par principe ( pas de zonage fait chez juritj) ce sera vide
   */
  @Prop(
    raw({
      introduction_subzonage: { type: Object }
    })
  )
  zoning?: {
    introduction_subzonage: {
      publication: string[]
    }
  }

  /**
   * Probablement dupliqué pubCategory (il peut y avoir plusieurs lettres), merge dans Label
   * Sébastien : pubCategory est un champ "historique", qui n'est plus utilisé pour le flux.
   * La propriété publication est alimenté par les nouveaux indicateurs positionnés en amont:
   * IND_BULLETIN, IND_RAPPORT, IND_LETTRE et IND_COMMUNIQUE (CC only)
   */
  //publication?: string[]

  /**
   * Champ session dans Label
   * circuit de relecture, pour la Cour de cassation ex: "FRR" formation restreinte
   */
  @Prop()
  formation?: string

  /**
   * Pas utilisé dans Label
   * catégorie pour l'occultation 1, 2, 3, 4 (1 = peu sensible, 4 = très sensible)
   */
  @Prop()
  blocOccultation?: number

  /**
   * Cour de cassation : circuit de relecture
   */
  @Prop()
  natureAffaireCivil?: string

  /**
   * Cour de cassation : circuit de relecture
   */
  @Prop()
  natureAffairePenal?: string

  /**
   * Cour de cassation : circuit de relecture
   */
  @Prop()
  codeMatiereCivil?: string

  /**
   * Cour d'appel : circuit de relecture (on n'enregistre pas le libellé du code NAC, c'est inutile)
   *
   * TODO : codeNAC
   */
  @Prop()
  NACCode?: string

  /**
   * Cour d'appel : circuit de relecture
   */
  @Prop()
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

export const DecisionSchema = SchemaFactory.createForClass(DecisionLabelDTO)

export function mapDecisionNormaliseeToLabelDecision(decision: DecisionModel): DecisionLabelDTO {
  console.log(parseDate(decision.metadonnees.dateDecision).toISOString())
  console.log(parseDate(decision.metadonnees.dateDecision).toISOString())

  return {
    appeals: [],
    chamberId: null,
    chamberName: null,
    dateCreation: new Date().toISOString(),
    dateDecision: parseDate(decision.metadonnees.dateDecision).toISOString(),
    jurisdictionCode: decision.metadonnees.codeJuridiction,
    jurisdictionId: decision.metadonnees.idJuridiction,
    jurisdictionName: decision.metadonnees.nomJuridiction,
    labelStatus: decision.metadonnees.labelStatus,
    labelTreatments: null,
    occultation: {
      additionalTerms: decision.metadonnees.occultationComplementaire,
      categoriesToOmit: []
    },
    originalText: decision.decision,
    parties: decision.metadonnees.parties,
    pseudoStatus: null,
    pseudoText: null,
    pubCategory: null,
    registerNumber: decision.metadonnees.numeroRegistre,
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
    natureAffaireCivil: decision.metadonnees.libelleNature,
    natureAffairePenal: null,
    codeMatiereCivil: decision.metadonnees.codeNature,
    NACCode: decision.metadonnees.codeNAC,
    endCaseCode: null
  }
}

function parseDate(dateDecision: string) {
  const y = dateDecision.substring(0, 4),
    m = dateDecision.substring(4, 6),
    d = dateDecision.substring(6, 8)
  return new Date(parseInt(y), parseInt(m), parseInt(d))
}
