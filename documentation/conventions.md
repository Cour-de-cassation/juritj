# Conventions d'équipe

# Table des matières
1. [Langues](#langues)
2. [Fonctions](#fonctions)
3. [Git](#git)
4. [Versionnage](#versionnage)
5. [Tests](#tests)
6. [IDE](#ide)


# Langues <a name="langues">
Les éléments liés au fonctionnel sont en français et les éléments techniques sont en anglais.
Par exemple :
- nous retrouvons les termes fonctionnels `metadonnees` ou `decisions` en français dans le code afin de rester au plus proche de notre métier
- sur des aspects plus techniques, nous avons définis des classes comme `StringToJson` ou `ValidateDto` en anglais

# Fonctions <a name="fonctions"></a>
## Granularité

Nous avons pour ambition de limiter chaque méthode / classe à une responsabilité.

## Nommage

Le nommage est le suivant : 
- classes et interfaces &rarr; PascalCase
- variables &rarr; camelCase
- variables d'environnement et constantes &rarr; SNAKE_CASE_MAJ

# Git <a name="git"></a>
## Branches
Notre stratégie de branches sur git suit le [trunk-based development](https://trunkbaseddevelopment.com/), en cohérence avec notre mode d'organisation et nos pratiques (pair programming, code review, présentiel régulier, etc...).

## Nommage des commits
Notre convention de nommage s'inspire de cet [article](https://buzut.net/cours/versioning-avec-git/bien-nommer-ses-commits).
Nos commits sont rédigés en anglais.

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
Nous utilisons l'option `Rebase and merge` sur [github](https://github.com/Cour-de-cassation) afin d'ajouter les commits à merger directement sur la branche `master`, et éviter les effets "colines" avec les commits de merge

# Versionnage <a name="versionnage"></a>

Nous nous inspirons de [semVer](https://semver.org/lang/fr/) avec les numéros de versions majeur et mineur &rarr; `MAJEUR.MINEUR`.

- MAJEUR = breaking change
- MINEUR = ajouts fonctionnels + correctifs

Par exemple : 2.4 => version majeur 2, mineur 4.

# Tests <a name="tests"></a>
Nous avons deux types de tests dans le projet : 
- des tests unitaire &rarr; testent le comportement d'un périmètre restreint
- des tests d'intégration &rarr; testent l'API dans son ensemble, en "boîte noire" 

Lors des tests des services de normalisation, les méthodes ne sont pas rattachés à une classe. Les spyOn sur ces fonctions sont donc utilisés avec l'import suivant :
```JS
import * as nomDuFichier from '/chemin/du/fichier'
...
jest.spyOn(nomDuFichier, 'methodeASpy')
```

La rédaction de la documentation des tests prend la forme suivante : 
```js
it('returns XXX when YYY')
```

# IDE <a name="IDE">
Le développement de ce projet est réalisé à l'aide de [VSCode](https://code.visualstudio.com/) avec les extensions suivantes :
 - ESLint
 - LiveShare
 - Jest