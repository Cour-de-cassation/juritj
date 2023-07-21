# Interface decisionType
Cette interface représente l'entité Decision dans notre base de données précédées des explications et des usages de celles-ci.

Le type est disponible via la librairie **dbsder-api-types** présent dans le **package.json**

```javascript
class DecisionType {
  /**
   * idMongo , Pas utilisé(cf Sebastien)
   * Sébastien : L'id MongoDB de la décision (ObjectId) est utilisé afin de générer
   * l'id de celle-ci dans Judilibre (string).
   */
  _id: ObjectId

  /**
   * pas utilisé (cf Sebastien)
   * Sébastien : Initialement prévu pour stocker le nombre de révisions successives de la décision,
   * au final pas utilisé.
   */
  _rev: number

  /**
   * Pas Utilisé (cf Sebastien)
   * Sébastien : Initialement prévu pour stocker le numéro de version du modèle de document,
   * afin de gérer finement d'éventuelles mises à jour de documents déjà publiés suite à des
   * évolutions du modèle, au final pas utilisé.
   */
  _version: number

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Groupe de métadonnées utilisées en partie pour la publication dans Judilibre
   */
   analysis: {
     analyse: string[]  Eléments de titrage et d'analyse complémentaires, non utilisé pour l'instant
                        (CC seulement)
     doctrine: string  Non utilisé
     link: string   Rapprochements de jurisprudence = références textuelles vers d'autres décisions de CC
                    (enrichissement saisi manuellement en amont, la plupart du temps postérieurement
                    à la publication - CC seulement)
     reference: Array<string>   Eléments de titrage et d'analyse complémentaires, non utilisé pour l'instant
                                (CC seulement)
     source: string   Non utilisé
     summary: string    Résumé de la décision (enrichissement saisi manuellement en amont,
                        la plupart du temps postérieurement à la publication - CC seulement)
     target: string   Texte(s) visé(s) (enrichissement saisi manuellement en amont,
                      la plupart du temps postérieurement à la publication - CC seulement)
     title: Array<string>   Eléments de titrage (enrichissement saisi manuellement en amont,
                            la plupart du temps postérieurement à la publication - CC seulement)
   }

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Numéro(s) de pourvoi de la décision
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
   * Sébastien : vaut uniquement pour CC, substitution en place via une API de l'Index (cf. https:github.com/Cour-de-cassation/openjustice-sder/blob/master/doc/chainage.md)
   */
   decatt?: number[]

  /**
   * Pas utilisé par Label
   * Sébastien : jurisdictionCode et jurisdictionId conservent les différentes manières
   * (plus ou moins homogènes) de codifier et/ou identifier la juridiction émettrice.
   * Utilisé (comme on peut) dans Judilibre.
   */
  
  jurisdictionCode: string

  /**
   * Pas utilisé par Label
   * Cf. jurisdictionCode.
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
   * Sébastien : Initialement prévu pour permettre de bloquer les traitemens sur une décision,
   * au final pas utilisé.
   */
  locked: boolean

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
     * (c'est une logique inversée : https:trello.com/c/JbujUt6o/276-changer-categoriestoomit-%C3%A0-categoriestoinclude)
     */
    categoriesToOmit: string[]
  }

  /**
   * Texte de la decision
   *
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
   * Sébastien : reprend en fait le statut de pseudonymisation initialisé
   * qui est utilisé en amont (dans les bases Oracle = champ IND_ANO) :
   *  - 0 : à traiter
   *  - 1 : en cours
   *  - 2 : traité
   *  - 4 : en erreur
   *
   */
  
  pseudoStatus: string

  /**
   * Texte pseudonymisé (publié sur Judilibre)
   *
   */
  
  pseudoText: string

  /**
   * Catégorie de diffusion, hérité de la Cour de cassation,
   * Utilisé pour l'UI Label + circuit de relecture + priorisation (publication à 14h) ;
   * 'B' = publié au Bulletin Cour de cassation, 'R' = publié au Rapport Cour de cassation,
   * 'L', 'C', 'W' = toutes les décisions CA, probablement toutes les décisions de TJ pareil
   *
   */
  
  pubCategory: string

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Sébastien : CA seulement, reprend et convertit en booléen la valeur de l'indicateur original JDEC_IND_DEC_PUB
   */
  public: boolean | null

  /**
   * Pas utilisé par Label (cf Sebastien)
   * Sébastien : numéro de la décision "au registre" (dépend de la source, dans sa signification
   * comme dans son utilisation pour la publication)
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
   * Sébastien : pubCategory est un champ "historique", qui n'est plus utilisé pour le flux.
   * La propriété publication est alimenté par les nouveaux indicateurs positionnés en amont:
   * IND_BULLETIN, IND_RAPPORT, IND_LETTRE et IND_COMMUNIQUE (CC only)
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
```