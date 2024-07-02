# Règles de filtrage pour les décisions des Tribunaux Judiciaires (TJ) :

## Introduction :

- Les règles décrite ci-dessous sont appliquées lors de la collecte et de la normalisation des décisions de TJ. Certaines règles de filtrage sont communes aux Cour d'appel, ces quelques règles sont donc mises en oeuvre au sein de l'[api-dbsder](https://github.com/Cour-de-cassation/dbsder-api) dans le but de réduire la duplication de code et d'harmoniser les filtrages en place.

- Les filtrages au sein de juritj sont de 2 type :
  1. rejet de la décision au niveau de l'API
  2. bloquage de la décision avant son traitement par [Label](https://github.com/Cour-de-cassation/label)

### Filtrage a la collecte de la décision :

Les données collectées au travers de l'API juritj doivent respecter le contrat d'interface établi. Les juridictions nous transmettent via l'API le fichier du texte intègre de la décision au format wordperfect assorti des métadonnées de la décision. Si les métadonnées ne sont pas fournies en totalité ou sont fournies dans un format incorrect alors la décision n'est pas acceptée par l'API avec une erreur HTTP 400. Cela agit comme un premier filtrage, les décision incomplètes ou mal formatées sont renvoyées en erreur aux juridictions.
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

Une fois la décision collectée, elle est normalisée au sein d'un batch qui effectue des filtrage en fonction des métadonnées de la décision. Les règles de filtrage présentées ici sont implémentées dans le fichier [computeLabelStatus](../src/batch/normalization/services/computeLabelStatus.ts). Si une décision est présente dans notre base de donnée avec un `labelStatus` différent de `toBeTreated` alors elle se sera pas traitée et restera bloquée jusqu'a un éventuel déblocage.
