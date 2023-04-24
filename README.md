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
N'oubliez pas d'installer **husky** pour obtenir les hooks de commit/push
```bash
npx husky install
```

### Démarrer l'application

Pour démarrer l'application, écrire dans un terminal : 

 ```bash
npm run start:dev #for the dev environment
 ```

Pour lancer l'application avec Docker, écrire dans un terminal : 
```bash
docker build . -t juritj:1.0.0
docker run -p 8005:3000 --env-file=.env juritj:1.0.0
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
DOC_LOGIN=loginDoc
DOC_PASSWORD=motDePasseDoc

### S3 Keys 
S3_ACCESS_KEY=CleAccesS3Scaleway
S3_SECRET_KEY=CleSecreteS3Scaleway
S3_URL=urlDuS3Scaleway
S3_REGION=region
S3_BUCKET_NAME_RAW=nomDuBucket
S3_BUCKET_NAME_NORMALIZED=nomDuBucket

# DB

MONGODB_URL=mongodb://url-du-mongo/
```

### Documentation complémentaire 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)
