# JuriTJ

JuriTJ est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet de passer en Open Data les décisions des tribunaux judiciaires.

## JuriTJ-Collect

JuriTJ-Collect est une API qui a pour objectif de collecter les décisions de justice de tribunaux judiciaires, afin de leur appliquer le traitement Judilibre (pseudonymisation et publication en Open Data). 

## Batch de normalisation 

Le batch de Normalisation est un programme qui a pour objectif de récupérer, traiter et stocker en base de données les décisions reçues au préalable par JuriTJ-Collect. 

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
CURRENT_ENV=local

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

### DB
MONGODB_URL=mongodb://localhost:55431/

### mTLS Certificates
SERVER_KEY="valeur de la clé privé du serveur"
SERVER_CERT="valeur du certificat du serveur"
WINCI_CA_CERT="valeur du certificat de l'autorité de certification WINCI"  
AUTO_SIGNED_CA_CERT="valeur du certificat de l'autorité de certification auto-signée"
```

Une fois le `.env` créé, le dupliquer et renommer le fichier nouvellement créé en `docker.env`. Adapter les valeurs des deux variables suivantes : 
```docker.env
MONGODB_URL=mongodb://db:55431/
S3_URL=http://bucket:9000 
```

### Zoom sur le CURRENT_ENV

La variable d'environnement `CURRENT_ENV` permet de faire varier le comportement de l'application selon son environnement :
- local : exécution de l'application sur les machines des développeurs
- dev : exécution de l'application en environnement de développement

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
npm run docker:start:db
npm run docker:start:s3
npm start:dev
```

Pour lancer le batch manuellement, écrire dans un terminal : 
```bash
npm run docker:build
npm run docker:start:db
npm run docker:start:s3
npm run batch:start
```

### Documentation JuriTJ 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)


### Configuration des certificats

Afin de disposer de certificats pour l'environnement de développement local, il nous faut d'abord les générer pour qu'ils soient envoyés sur le container de l'api

1. Se rendre dans `/secrets/dev`

2. Lancer la commande `./generate-keys.sh` (s'assurer d'avoir les droits d'exécution `chmod +x generate-keys.sh`) afin de générer l'autorité de certification autosignée et les certificats qui en dépendent

3. Revenir sur le dossier racine de l'api ( `cd ../..` depuis `secrets/dev`)

4. Sur Postman, [insérer les certificats](https://learning.postman.com/docs/sending-requests/certificates/) client : `client-cert.pem`, `client-key.pem` pour le host http://localhost:3009 (comme définis pour l'API dans le fichier docker-compose.local.yml)

5. Sur Postman toujours, ajouter le certificat de l'autorité de certification autosignée `ca-cert.pem`

6. Alimenter le fichier `.env` avec la valeurs des clés nécessaires (`SERVER_KEY`, `SERVER_CERT`, `WINCI_CA_CERT`, `AUTO_SIGNED_CA_CERT`)

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