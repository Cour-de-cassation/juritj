# Collections Postman

Les fichiers présents dans ce dossier permettent de lancer les requêtes sur le client Postman

## Installation

### Fichier ` *.postman_environment.json`
 
Ce fichier contient le nom des des variables utilisés dans Postman. Pour l'importer, se référer à [ce tutoriel](https://welovedevs.com/fr/articles/postman/).
L'exécutions des requêtes s'effectue temporairement sur un environnement de développement hébergé chez Scalingo. Le fichier sera mis à jour dès la disponibilité d'un environnement de sandbox.

### Fichier ` *.postman_collection.json`

Ce fichier JSON contient la liste des requêtes possibles sur notre application
Pour l'importer, se référer au tutoriel précédent

### Point d'attention

Au premier import de la collection, les requêtes ayant un fichier indiqué dans le `body` ne fonctionnent pas : le fichier n'est pas trouvé par postman. 
Il faut donc le ré-importer depuis le dossier `fichier-exemples` : 
- Le scénario `Envoie d'une décision avec un fichier au mauvais format` s'appuie sur le fichier `octoLogo.jpg`
- Pour les autres scénarios ayant besoin d'un fichier, utiliser le fichier `business_plan.wpd`