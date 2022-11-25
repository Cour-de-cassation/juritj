# Conventions d'équipe

# Table des matières
1. [Fonctions](#fonctions)
2. [Git](#git)
3. [Versionnage](#versionnage)
4. [Tests](#tests)

# Fonctions <a name="fonctions"></a>
## Granularité

Idéalement, une responsabilité pour chaque méthode ou classe. 

## Nommage

Le nommage est le suivant : 
- classes et interfaces &rarr; PascalCase
- variables &rarr; camelCase
- variables d'environnement et constantes &rarr; SNAKE_CASE_MAJ

# Git <a name="git"></a>
## Branches
Notre stratégie de branches sur git suit le [trunk-based development](https://trunkbaseddevelopment.com/).

## Nommage des commits
Notre convention de nommage s'inspire de cet [article](https://buzut.net/cours/versioning-avec-git/bien-nommer-ses-commits).

`<type>(<portée>): <sujet>`

Pour les `type` :
- feat : pour les fonctionnalités &rarr; impact sur l'utilisateur
- tech : pour le réusinage du code et les tâches tech &rarr; pas d'impact sur l'utilisateur
- fix : en cas de bug 
- docs : pour la documentation

Pour la `portée` nous nous réfèrerons au numéro du ticket.

Pour le `sujet`, nous décrirons ce qui a été fait et pourquoi ça a été fait au présent.

Par exemple : `feat(292): add POST /decisions to allow WinCI TGI to send decisons`

## Merge
Nous utiliserons l'option `Rebase and merge` sur [github](https://github.com/Cour-de-cassation) afin d'ajouter les commits à merger directement sur la branche `master`, et éviter les effets "colines" avec les commits de merge

# Versionnage <a name="versionnage"></a>

Nous nous inspirerons de [semVer](https://semver.org/lang/fr/) avec les numéros de versions majeur et mineur &rarr; `MAJEUR.MINEUR`.

- MAJEUR = breaking change
- MINEUR = ajouts fonctionnels + correctifs

Par exemple : 2.4 => version majeur 2, mineur 4.

# Tests <a name="tests"></a>
Nous avons deux types de tests dans le projet : 
- des tests unitaire &rarr; chaque fonction est testée individuellement
- des tests d'intégration &rarr; l'application est simulée entièrement 

# ADR (Architecture Decision Report)<a name="adr"></a>

Les décisions techniques sont retranscrites dans un fichier `insert file here` Markdown afin de pouvoir comprendre le raisonnement derrière les différents choix pris.


# IDE <a name="IDE">

Le développement de ce projet a été réalisé à l'aide de [VSCode](https://code.visualstudio.com/) avec les extensions suivantes :
 - ESLint
 - LiveShare
 - Jest

