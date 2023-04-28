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


### Docker en local

#### Configuration des certificats

Afin de disposer de certificats pour l'environnement de développement local, il nous faut d'abord les générer pour qu'ils soient envoyés sur le container de l'api

1. Se rendre dans `/secrets/dev`

2. Lancer la commande `./generate-keys.sh` (s'assurer d'avoir les droits d'exécution `chmod +x generate-keys.sh`) afin de générer l'autorité de certification autosignée et les certificats qui en dépendent

3. Revenir sur le dossier racine de l'api ( `cd ../..` depuis `secrets/dev`)

4. Sur Postman, [insérer les certificats](https://learning.postman.com/docs/sending-requests/certificates/) client : `client-cert.pem`, `client-key.pem` pour le host http://localhost:3009 (comme définis pour l'API dans le fichier docker-compose.local.yml)

5. Sur Postman toujours, ajouter le certificat de l'autorité de certification autosignée `ca-cert.pem`

#### Configuration de minio

1. Lancer un premier build de docker 

```bash
docker-compose -f docker-compose.local.yml build
```

2. Lancer les containers (l'API ne se lancera pas)

```bash
docker-compose -f docker-compose.local.yml up -d
```

3. Recupérer l'URL interne de minio
    - Sur Docker Desktop, dans `Containers`, cliquer sur `bucket`
    - Aller dans la sections `Logs`, et récupérer le dernier `API: http://XXXX.X.X.X` 
    - Le copier dans `S3_URL` présent dans le `docker-compose.local.yml` 

4. Se connecter au [minio s3](http://localhost:9001)
    - S'identifier (les identifiants se trouvent dans `docker-compose.local.yaml` > `MINIO_USER` et `MINIO_PASSWORD`)
    - Creer les clés d'accès (Barre latérale > User > Access Keys) puis les rentrer dans les variables `S3_ACCESS_KEY` et `S3_SECRET_KEY` se trouvant dans `docker-compose.local.yaml`
    - Créer les buckets (Administrator > Buckets) en reprenant les noms de `S3_BUCKET_NAME_RAW` et `S3_BUCKET_NAME_NORMALIZED` 

5. Puis lancer l'application à nouveau (l'API devrait se recréer):

```bash
docker-compose -f docker-compose.local.yml up -d
 ```

6. En cas d'arrêt des conteneurs, refaire l'étape 3

#### Configuration de mongoDB

1. Récupérer l'URL interne de mongoDB
    - Dans le terminal, tapez `docker ps` et récupérer l'ID du conteneur mongoDB 
    - Tapez `docker inspect MONGODB_CONTAINER_ID | grep "IPAddress"`
    - L'advdresse IP du conteneur MongoDB s'affiche sous la forme suivante : 
        - `"IPAddress": "172.18.0.3",`

2. Remplacez l'addresse IP dans `MONGODB_URL` en conservant le port et le format : `mongodb://XX.XX.XX.XX:55431/`

3. Relancer l'application

```bash
docker-compose -f docker-compose.local.yml up -d
 ```
