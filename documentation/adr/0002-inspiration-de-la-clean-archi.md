# Inspiration de la Clean Architecture

Date : 30/11/2022

## Statut

**<span style="color:green">Accepté</span>**

## Contexte

JuriTJ est une nouvelle brique applicative. Nous avons la liberté de choisir l'architecture applicative qui nous semble la plus pertinente pour répondre aux enjeux fonctionnels. Notre choix s'est intuitivement porté sur la Clean Architecture, mais avant de valider un tel choix, nous avons voulu la comparer à l'architecture orientée services. 

### La Clean Architecture, c'est quoi ? 

La [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) définit des principes d'architecture applicative qui répondent à un enjeu majeur : isoler la logique métier de toute contrainte technique (framework, librairies, APIs, base de données...). 

De ce fait, il devient plus simple et moins coûteux de : 
- Mettre en place des tests sur cette logique métier isolée
- Supprimer ou remplacer une dépendance technique (base de données, framework...)
- Faire évoluer le parcours utilisateurs le cas échéant

![Clean Architecture](../images/0002-clean-architecture.jpg)
Définissons quelques principes clés de la Clean Architecture : 
- Les `Entities` sont des objets "métiers" : ils contiennent les objets et les règles de gestions propres à l'entreprise (exemple : une décision de justice peut être considérée comme une entitée métier)
- Les `Use cases` sont des "cas d'usages" : ils définissent les règles de gestions propres à un besoin fonctionnel de l'application (exemple : pseudonimiser une décision de justice)
- Nous appelerons les couches supérieurs `Infrastructure` : nous y trouvons la couche d'exposition de l'application (exemple : les `endpoints` de l'API), l'implémentation d'interface à des dépendances externes et la couche de dépendances externes (telles que la base de données, des APIs, des UIs...) 
- Nous pouvons voir sur le schéma que des flèches vont de l'extérieur vers l'intérieur : une couche "supérieure" peut utiliser une couche "inférieure" mais pas l'inverse. Quelques exemples afin de rendre ce point un peu plus concret : 
    - L'entité "Décision de justice" ne pourra pas interagir directement avec la base de données (les entités d'ORM ne sont donc pas des entités métier). 
    - L'interaction avec une base de données doit être interfacée et injectée à la couche `Use Case` : l'injection d'une dépendance technique permet, en cas d'évolution de cette dépendance technique, de ne pas impacter la logique métier. Seule la couche `Infrastructure` sera impactée. 
    - Les fonctionnalités du framework sont utilisées uniquement dans la couche `Infrastructure`. Les couches `Use cases` et `Entities` sont totalement agnostiques du framework, facilitant leur maintenance dans le temps

### L'architecture orientée services, c'est quoi ? 

Par "Architecture orientée services", nous entendons une application composée d'un ensemble de services ayant chacun leur périmètre de responsabilité (exemples : "sauvegarder une donnée", "récupérer une donnée", "envoyer les données à une dépendance"), orchestrés par des controlleurs qui répondent eux-mêmes à un besoin plus global.

Ce type d'approche est adapté à un contexte disposant de peu de règles métiers et d'un périmètre fonctionnel restreint. 
Elle peut en revanche se transformer en frein si le périmètre grossit : chaque service est susceptible de dépendre d'un autre service, et chaque service contient potentiellement des responsabilité technico-fonctionnelles (exemple : des règles métiers et la sauvegarde en base de données dans le même service). 

### Tableau comparatif 

| Thématique  | Clean architecture | Architecture orientée services | Notre avis |
|--------|------------|------------|------------|
| Faciliter la passation et la montée en compétences de nouveaux développeurs | Montée en compétences plus longue afin de comprendre ses concepts. Apporte une approche plus "structurée" dans le temps. | Permet d'aller plus vite, mais moins viable dans le temps si le périmètre grossit. | Avantage **Clean architecture** : sa structuration nous semble être un avantage non négligeable pour une application qui a vocation à vivre dans le temps. |
| Le périmètre contient-il beaucoup de règles fonctionnelles ? | Adapté pour un contexte métier riche. | Adapté pour un contexte métier allégé et de l'interconnexion de services. | Avantage **Architecture orientée services** : l'application va porter peu de règles fonctionnelles et a pour objectif de s'interconnecter avec d'autres applicatifs. |
| Avec quelle architecture les développeurs de l'équipe sont-ils le plus à l'aise ? | - | - | Avantage **Clean architecture** : mise en place à plusieurs reprises par certains membres de l'équipe. |
| Temporalité | Mise en oeuvre moins rapide au début, mais plus structurée et évolutive dans le temps. | Permet d'aller vite dès le début, mais peut poser problème dans le temps | Avantage **Clean architecture** : gain de temps dans la durée (l'application doit rester viable dans le temps). |
| Avis de l'équipe interne | - | - | Avantage **Clean architecture** : l'équipe interne souhaite une approche structurée, avec des concepts que l'on pourrait réutiliser d'une application à l'autre afin d'apporter de la cohérence. |
| Complexité de mise en oeuvre | Demande un effort au début de sa mise en oeuvre, puis dans la durée afin d'appliquer ses différents patterns. | Nécessite une vigilance constante pour identifier les axes de découpage, afin de conserver une base de code lisible et évolutive. |Avantage **Clean architecture** : nous avions déjà posé certaines bases lors du comparatif, il était donc moins complexe de continuer sur ces bases. |

## Décision
Nous choisissons de nous inspirer des principes de Clean Architecture afin de structurer les différentes responsabilités du code produit par l'équipe. Trois dossiers seront créés pour intégrer ces principes : 
- `domain` pour les entités métiers 
- `usecase` pour les cas d'usages
- `infrastructure` pour l'exposition et la gestion des dépendances externes 

