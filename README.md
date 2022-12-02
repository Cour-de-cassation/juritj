# Juritj-Collect

JuriTJ Collect est une API qui a pour objectif de collecter les décisions de justice de tribunaux judiciaires, afin de leur appliquer le traitement Judilibre (pseudonimisation et publication en Open Data). 

### Pré-requis
- Installer [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

### Installation 

Pour installer les packages nécessaire au bon fonctionnement de l'application, ouvrez votre terminal et tapez : 
```bash
npm install
```  
### Démarrer l'application

Pour démarrer l'application, vous pouvez taper : 

 ```bash
npm run start:dev #for the dev environment
 ```

### Tests

Pour lancer les tests, vous pouvez taper : 

 ```bash
npm run test
 ```

### Variables d'environnement : créez un fichier `.env` à la racine du dossier avec les variables suivantes

```.env
### API DOCUMENTATION
DOC_LOGIN=votre_login
DOC_PASSWORD=votre_mot_de_passe
```

### Documentation complémentaire 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
