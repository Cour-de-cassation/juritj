# Règles de filtrage pour les décisions des Tribunaux Judiciaires (TJ) :

## Introduction :

- Les règles décrites ci-dessous sont appliquées lors de la collecte et lors de la normalisation des décisions de TJ. Certaines règles de filtrage sont communes aux Cour d'appel, ces quelques règles sont donc mises en oeuvre au sein de l'[api-dbsder](https://github.com/Cour-de-cassation/dbsder-api) dans le but de réduire la duplication de code et d'harmoniser les filtrages en place.

- Les filtrages au sein de juritj sont de 2 type :
  1. rejet de la décision au niveau de l'API de collecte
  2. bloquage de la décision avant son traitement par [Label](https://github.com/Cour-de-cassation/label) au niveau de la normalisation

### Filtrage à la collecte de la décision :

Une transmission de décision à la Cour de cassation pour mise en _open data_ comporte 2 éléments :

- le texte intègre de la décision au format wordperfect
- les métadonnées de la décision au format JSON

#### Fichier wordperfect

Le fichier wordperfect transmis doit avoir une taille inférieure à 10Mo, sinon une erreur HTTP 400 est renvoyée par l'API.

#### Métadonnées

Les métadonnées collectées au travers de l'API juritj doivent respecter le contrat d'interface établi. Si les métadonnées ne sont pas fournies en totalité ou sont fournies dans un format incorrect alors la décision n'est pas acceptée par l'API avec une erreur HTTP 400. Ainsi, la juridiction est informée du rejet de la collecte de sa décision.
Voici les critères que les métadonnées doivent respecter pour que la décision soit acceptée par l'API (défini [ici](../src/shared/infrastructure/dto/metadonnees.dto.ts) dans le code) :

| Nom de la variable        | Type de variable | Obligatoire | Autre validation                                                           |
| ------------------------- | ---------------- | ----------- | -------------------------------------------------------------------------- |
| nomJuridiction            | string           | Oui         | Longueur entre 2 et 42 caractères                                          |
| idJuridiction             | string           | Oui         | Doit correspondre au format : commence par 'TJ' suivi de 5 chiffres        |
| codeJuridiction           | string           | Non         | -                                                                          |
| numeroRegistre            | string           | Oui         | Longueur de 1 caractère                                                    |
| numeroRoleGeneral         | string           | Oui         | Doit correspondre au format : 2 chiffres, un '/', suivi de 5 chiffres      |
| numeroMesureInstruction   | string[]         | Non         | Chaque élément doit avoir une longueur de 10 caractères                    |
| codeService               | string           | Oui         | Doit correspondre au format : 2 caractères non blancs                      |
| libelleService            | string           | Oui         | Longueur entre 0 et 25 caractères                                          |
| dateDecision              | string           | Oui         | Doit correspondre au format : 8 chiffres (AAAAMMJJ)                        |
| codeDecision              | string           | Oui         | Doit correspondre au format : 3 caractères alphanumériques                 |
| libelleCodeDecision       | string           | Oui         | Longueur entre 0 et 200 caractères                                         |
| president                 | complexe         | Non         | -                                                                          |
| decisionAssociee          | complexe         | Non         | -                                                                          |
| parties                   | complexe         | Non         | -                                                                          |
| sommaire                  | string           | Non         | -                                                                          |
| codeNAC                   | string           | Oui         | Doit correspondre au format : 3 caractères alphanumériques                 |
| libelleNAC                | string           | Oui         | -                                                                          |
| codeNature                | string           | Non         | Doit correspondre au format : 0 à 2 caractères alphanumériques ou espaces  |
| libelleNature             | string           | Non         | -                                                                          |
| decisionPublique          | boolean          | Oui         | -                                                                          |
| recommandationOccultation | complexe         | Oui         | Uniquement les valeurs 'conforme', 'aucune', 'substituant' ou 'complément' |
| occultationComplementaire | string           | Non         | -                                                                          |
| selection                 | boolean          | Oui         | -                                                                          |
| matiereDeterminee         | boolean          | Oui         | -                                                                          |
| pourvoiLocal              | boolean          | Oui         | -                                                                          |
| pourvoiCourDeCassation    | boolean          | Oui         | -                                                                          |
| debatPublic               | boolean          | Oui         | -                                                                          |
| idDecision                | string           | Non         | -                                                                          |
| indicateurQPC             | boolean          | Non         | -                                                                          |

### Filtrage par validation des métadonnées

Une fois la décision collectée, elle est normalisée au sein d'un batch qui effectue des filtrages en fonction des métadonnées de la décision. Les règles de filtrage présentées ici sont implémentées dans le fichier [computeLabelStatus](../src/batch/normalization/services/computeLabelStatus.ts). Le blocage de la décision s'effectue via son champ `labelStatus`. Si une décision est présente dans notre base de donnée avec un `labelStatus` différent de `toBeTreated` alors elle ne sera pas traitée et restera bloquée jusqu'à un éventuel déblocage.
Etant donné qu'une décision ne peut avoir qu'une seule raison de blocage, le filtrage est effectué de manière séquentielle. Si une décision est bloquée selon un filtre alors les filtres suivants ne sont pas évalués et la décision est bloquée avec le `labelStatus` associé au premier blocage rencontré.

1. Si la date de la décision est dans l'avenir : `labelStatus = ignored_dateDecisionIncoherente`
2. Si la date de la décision est antérieure au 15/12/2023, date de la mise en service de l'Open data des décisions des tribunaux judiciaires : `labelStatus = ignored_dateAvantMiseEnService`
3. Si le code de décision est présent dans la [liste des codes de décision ne présentant pas d'intérêts](../src/batch/normalization/infrastructure/codeDecisionList.ts) : `labelStatus = ignored_codeDecisionBloqueCC`
4. Si le texte contient des caractères qui ne sont pas dans la [liste des caractères acceptables](../src/batch/normalization/infrastructure/authorizedCharactersList.ts) (La conversion du texte de la décision du format wordperfect vers texte entraîne parfois l'apparition de caractères spéciaux non désirés.) : `labelStatus = ignored_caractereInconnu`

La décision est ensuite insérée dans la base SDER via l'api-dbsder, ou d'autres filtres sont en place.
