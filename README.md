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

### Minio 
S3_BUCKET_NAME_RAW=bucketName
S3_BUCKET_NAME_NORMALIZED=bucketName
S3_URL=accessUrl
S3_ACCESS_KEY=accessKey
S3_SECRET_KEY=secretKey
S3_REGION=region

### DB
MONGODB_URL=mongodb://url-du-mongo/

### mTLS Certificates
SERVER_KEY="multiline server private key"
SERVER_CERT="multiline server certificate"
SERVER_CA_CERT="multiline CA certificate"
SERVER_CA_KEY="multiline CA private key"
WINCI_CA_CERT="multiline Winci CA certificate"
```

### Documentation complémentaire 

Le dossier `/documentation` contient : 
- `conventions.md` qui liste les choix de l'équipe concernant la base de code 
- Le dossier `adr` qui historise les choix structurant de l'équipe 
- Les requêtes Postman et comment les installer [lien](documentation/postman/README.md)


### Docker en local

#### Configuration des certificats

Afin de disposer de certificats pour l'environnement de développement local, il nous faut d'abord les générer pour qu'ils soient envoyés sur le container de l'api

1. Se rendre dans `/secrets/dev`

2. Lancer la commande `./generate-keys.sh` (s'assurer d'avoir les droits d'exécution `chmod +x generate-keys.sh`) afin de générer l'autorité de certification autosignée et les certificats qui en dépendent

3. Revenir sur le dossier racine de l'api ( `cd ../..` depuis `secrets/dev`)

4. Sur Postman, [insérer les certificats](https://learning.postman.com/docs/sending-requests/certificates/) client : `client-cert.pem`, `client-key.pem` pour le host http://localhost:3009 (comme définis pour l'API dans le fichier docker-compose.local.yml)

5. Sur Postman toujours, ajouter le certificat de l'autorité de certification autosignée `ca-cert.pem`

6. Alimenter le fichier `.env` avec la valeurs des clés nécessaires (`SERVER_KEY`, `SERVER_CERT`, `SERVER_CA_CERT`, `SERVER_CA_KEY`, `WINCI_CA_CERT`)

#### Lancer l'application

1. Lancer le build de docker 

```bash
docker-compose -f docker-compose.local.yml build
```

ou 

```bash
npm run docker:build
```

2. Lancer les containers (l'API ne se lancera pas)

```bash
docker-compose -f docker-compose.local.yml up -d
```

ou 

```bash
npm run docker:start
```

## CI

### Lancer un job depuis une branche spécifique

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