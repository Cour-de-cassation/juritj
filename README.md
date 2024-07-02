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

Il est également nécessaire d'installer `libwpd` en local afin d'exécuter le batch.
Sur macOS :

```bash
brew install libwpd
```

Sur linux :

```bash
apt-get install libwpd-tools
```

### Tests

Pour lancer les tests, écrire dans un terminal :

```bash
npm run test
```

Il est également possible de ne lancer que les tests d'API (`npm run test:api`), de batch (npm run test:batch`) ou d'intégration (`npm run test:integration`).

### Variables d'environnement en local

JuriTJ a besoin de deux fichiers de variables d'environnements :

- Dupliquer le fichier `docker.env.example` et le rennomer `docker.env`, adapter les variables d'environnement si besoin
- Dupliquer le fichier `.env.example` et le rennomer `.env`, adapter les variables d'environnement si besoin

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

1.  Récupérer le certificat client, la clé privée client et le certificat d'autorité de certification auto-signé
2.  [Insérer la clé privée client et certificats](https://learning.postman.com/docs/sending-requests/certificates/) sur Postman
3.  Récupérer les collections et les configurations d'environnements Postman dans le [dossier de documentation](./documentation/postman/)
4.  Les importer dans Postman

### Démarrer l'application en local

Démarrer l'application nécessite au préalable d'initaliser les fichiers de variables d'environnement.

- Pour lancer l'ensemble de JuriTJ avec Docker :

  ```bash
  npm run docker:build
  npm run docker:start
  ```

- Pour lancer l'API en phase de développement et afin de disposer d'une mise à jour à chaud du serveur à chaque changement:

  ```bash
  npm run docker:build
  npm run docker:start:s3
  npm run start:dev
  ```

- Pour lancer le batch de normalisation manuellement, écrire dans un terminal :

  ```bash
  npm run docker:build
  npm run docker:start:s3
  npm run batch:start
  ```

  Attention, pour que le batch fonctionne, préciser l'url de l'API DBSDER dans les fichiers de variables d'environnement.

- Autres commandes utiles :
  - Stopper tous les container :
    ```bash
    npm run docker:stop
    ```
  - Stopper le container du S3 :
    ```bash
    npm run docker:stop:s3
    ```
  - Arrêter et nettoyer l'environnement docker de l'application :
    ```bash
    npm run docker:kill
    ```
  - Lancer le lint et le formatage du code :
    ```bash
    npm run fix
    ```

### Documentation JuriTJ

Le dossier `/documentation` contient :

- [filtrage.md](documentation/filtrage.md) qui exprime les règles de filtrage mises en place pour les décisions des tribunaux judiciaires dans le cadre de l'open data des décisions de justice.
- [conventions.md](documentation/conventions.md) qui liste les choix de l'équipe concernant la base de code
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

## Configuration des buckets

1. le bucket doit tourner
2. executer

```bash
kubectl run -i --tty --rm --namespace juritj --image=minio/mc -- bash
```

3. executer ces commandes dans le conteneur
   JURITJ_S3_ACCESS_KEY et JURITJ_S3_SECRET_KEY sont à récuperer dans les variables ci/cd GITLAB

_exemple pour un bucket_

```BASH
mc config host add myminio http://bucket-service:9000 $JURITJ_S3_ACCESS_KEY $JURITJ_S3_SECRET_KEY
mc mb --ignore-existing myminio/juritj-test-bucket
mc policy download myminio/juritj-test-bucket
```
