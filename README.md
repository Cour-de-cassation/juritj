# JuriTJ

JuriTJ est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet de passer en Open Data les décisions des tribunaux judiciaires.

## JuriTJ-Collect

JuriTJ-Collect est une API qui a pour objectif de collecter les décisions de justice de tribunaux judiciaires, afin de leur appliquer le traitement Judilibre (pseudonymisation et publication en Open Data). 

## Batch de normalisation 

Le batch de Normalisation est un programme qui a pour objectif de récupérer, traiter et stocker en base de données les décisions reçues au préalable par JuriTJ-Collect. 

### Pré-requis
- Installer [nvm](https://github.com/nvm-sh/nvm) afin d'avoir la version utilisée pour cette application et lancer la commande :
```bash
nvm install
```

### Installation 

Pour installer les packages nécessaires au bon fonctionnement de l'application, ouvrir un terminal et entrer la commande suivante : 
```bash
npm install
```  
N'oubliez pas d'installer **husky** pour obtenir les hooks de commit/push
```bash
npx husky install
```

Il est également nécessaire d'installer `libwpd` en local afin d'exécuter le batch. 
Sur macOS : 
```
brew install libwpd
```

### Tests

Pour lancer les tests, écrire dans un terminal : 

 ```bash
npm run test
 ```

 Il est également possible de ne lancer que les tests d'API (`npm run test:api`), de batch (npm run test:batch`) ou d'intégration (`npm run test:integration`). 

### Variables d'environnement en local

JuriTJ a besoin de deux fichiers de variables d'environnements : 
- `.env` dédié à l'exécution sans docker
- `docker.env` dédié à l'exécution par docker 

Créer un fichier `.env` à la racine du dossier avec les variables suivantes :

```.env
### Pour désactiver la coloration des logs
NO_COLOR=true 

### API DOCUMENTATION
DOC_LOGIN=root
DOC_PASSWORD=root

### Minio 
S3_BUCKET_NAME_RAW=juritj-test-bucket
S3_BUCKET_NAME_NORMALIZED=juritj-test-bucket-normalized
S3_URL=http://localhost:9000 
S3_ACCESS_KEY=local_access_key
S3_SECRET_KEY=local_secret_key
S3_REGION=eu-west-paris-1

### DbSder API
DBSDER_API_URL=http://dbsder-api:3000
DBSDER_API_KEY=normalization_api_key

```

Une fois le `.env` créé, le dupliquer et renommer le fichier nouvellement créé en `docker.env`. Adapter les valeurs des variables suivantes : 
```docker.env
S3_URL=http://bucket:9000 
DBSDER_API_URL=http://dbsder-api:3000
DBSDER_API_KEY=normalization_api_key
```

### Configuration des certificats

Les certificats étant gérés par l'infrastructure, nous n'avons pas de configuration à effectuer en local. 

Pour l'environnement de développement :  
- La gestion des certificats est gérée par l'infrastructure 
- Elle dispose des éléments suivants : 
    - Certificat de l'autorité de certification WINCI, signé par PEKIN, afin d'autoriser les appels effectués par des clients disposant d'un certificat PEKIN
    - Certificat de l'autorité de certification auto-signée, afin d'autoriser les appels effectués par des clients disposant d'un certificat auto-signé (pour permettre les tests en environnement de développement)
    - Certificat serveur signé par PEKIN 
    - Clé privée serveur 
    - Mot de passe de la clé privée serveur 

Pour effectuer des tests Postman sur l'environnement de développement : 
 1. Récupérer le certificat client, la clé privée client et le certificat d'autorité de certification auto-signé 
 2. [Insérer la clé privée client et certificats](https://learning.postman.com/docs/sending-requests/certificates/) sur Postman
 3. Récupérer les collections et les configurations d'environnements Postman dans le [dossier de documentation](./documentation/postman/)
 4. Les importer dans Postman

### Démarrer l'application en local

Démarrer l'application nécessite au préalable d'initaliser les fichiers de variables d'environnement. 

Pour lancer l'ensemble de JuriTJ avec Docker, écrire dans un terminal : 
```bash
npm run docker:build
npm run docker:start
```

Pour lancer l'API en phase de développement et afin de disposer d'une mise à jour à chaud du serveur à chaque changement, écrire dans un terminal : 
```bash
npm run docker:build
npm run docker:start:s3
npm run start:dev
```

Pour lancer le batch de normalisation manuellement, écrire dans un terminal : 
```bash
npm run docker:build
npm run docker:start:s3
npm run batch:start
```
Attention, pour que le batch fonctionne, préciser l'url de l'API DBSDER dans le docker.env. 

### Documentation JuriTJ 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)

### CI

#### Lancer un job depuis une branche spécifique

Sur le `gitlab-ci.yml`, il est possible de spécifier une branche dans un des différents jobs afin de le lancer sur la CI
Il suffit d'ajouter à la catégorie `only:` du job désiré, en dernière position, le nom de la branche : 
```yml
test: # job
    ...
    only:
        - master # branche principale où le job se lance
        - <nomDeLaBranche>
```

 Une fois cette branche poussée, la CI lancera le job automatiquement (compter 5 mns de délai environ)