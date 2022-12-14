# JuriTJ

JuriTJ est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet de passer en Open Data les décisions des tribunaux judiciaires.

## JuriTJ-Collect

JuriTJ Collect est une API qui a pour objectif de collecter les décisions de justice de tribunaux judiciaires, afin de leur appliquer le traitement Judilibre (pseudonymisation et publication en Open Data). 

### Pré-requis
- Installer [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

### Installation 

Pour installer les packages nécessaires au bon fonctionnement de l'application, ouvrir un terminal et entrer la commande suivante : 
```bash
npm install
```  
### Démarrer l'application

Pour démarrer l'application, écrire dans un terminal : 

 ```bash
npm run start:dev #for the dev environment
 ```

### Tests

Pour lancer les tests, écrire dans un terminal : 

 ```bash
npm run test
 ```

### Variables d'environnement : 

Créer un fichier `.env` à la racine du dossier avec les variables suivantes :

```.env
### API DOCUMENTATION
DOC_LOGIN=votre_login
DOC_PASSWORD=votre_mot_de_passe
```

### Documentation complémentaire 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
