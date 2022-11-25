# Conventions d'équipe

# Table des matières
1. [Fonctions](#fonctions)
2. [Git](#git)
3. [Versionnage](#versionnage)

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

# Versionnage <a name="versionnage"></a>