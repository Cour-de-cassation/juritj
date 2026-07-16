# JuriTJ

JuriTJ est une brique applicative du projet [Judilibre](https://www.courdecassation.fr/toutes-les-actualites/2021/10/01/judilibre-les-decisions-judiciaires-en-open-data) qui permet de collecter les décisions des Tribunaux Judiciaires.

### Pré-requis

L'application nécessite node ainsi qu'un bucket S3. Le projet [juridependencies](https://github.com/Cour-de-cassation/juridependencies) permet de lancer facilement cette dépendance avec un jeu de fausse données.

La version de Node utilisée par ce projet est indiquée dans le fichier [.nvmrc](.nvmrc).

### Installation

Pour installer les packages nécessaires au bon fonctionnement de l'application, ouvrir un terminal et entrer la commande suivante :

```bash
npm install
```

### Variables d'environnement en local

- Dupliquer le fichier `.env.example` et le rennomer `.env`, adapter les variables d'environnement si besoin

### Démarrer l'application en local

Démarrer l'application nécessite au préalable d'initaliser les fichiers de variables d'environnement et de disposer des pré-requis suscités.

- Pour lancer l'ensemble de JuriTJ avec Docker (hot-reload inclu) :

  ```bash
  npm run start:docker
  ```

- Pour lancer l'API en phase de développement et afin de disposer d'une mise à jour à chaud du serveur à chaque changement:

  ```bash
  npm run start:watch
  ```

- Lancer le lint et le formatage du code :
  ```bash
  npm run fix
  ```

#### Configuration des certificats

Les certificats étant gérés au niveau de l'infrastructure, nous n'avons pas de configuration à effectuer en local.

Les éléments suivant ont été installés sur l'infrastructure :

- Certificat de l'autorité de certification WINCI, signé par PEKIN, afin d'autoriser les appels effectués par des clients disposant d'un certificat PEKIN
- Pour l'environement de developpement : Certificat de l'autorité de certification auto-signée, afin d'autoriser les appels effectués par des clients disposant d'un certificat auto-signé (pour permettre les tests)
- Certificat serveur signé par PEKIN
- Clé privée serveur
- Mot de passe de la clé privée serveur
