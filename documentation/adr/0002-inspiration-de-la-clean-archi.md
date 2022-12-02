# Inspiration de la Clean Architecture

Date : 30/11/2022

## Statut

**<span style="color:green">Accepté</span>**

## Contexte

La [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) définit des principes d'architecture applicative qui répondent à un enjeu majeur : isoler la logique métier de toute contrainte technique (framework, librairies, APIs, base de données...). 

De ce fait, il devient plus simple et moins coûteux de : 
- Mettre en place des tests sur cette logique métier isolée
- Supprimer ou remplacer une dépendance technique (base de données, framework...)
- Faire évoluer le parcours utilisateurs le cas échéant

#### Quelques principes clés
![Clean Architecture](../images/0002-clean-architecture.jpg)
Définissons quelques principes clés de la Clean Architecture : 
- Les `Entities` sont des objets "métiers" : ils contiennent les objets et les règles de gestions propres à l'entreprise (exemple : une décision de justice peut être considérée comme une entitée métier)
- Les `Use cases` sont des "cas d'usages" : ils définissent les règles de gestions propres à un besoin fonctionnel de l'application (exemple : pseudonimiser une décision de justice)
- Nous appelerons les couches supérieurs `Infrastructure` : nous y trouvons la couche d'exposition de l'application (exemple : les `endpoints` de l'API), l'implémentation d'interface à des dépendances externes et la couche de dépendances externes (telles que la base de données, des APIs, des UIs...) 
- Nous pouvons voir sur le schéma que des flèches vont de l'extérieur vers l'intérieur : une couche "supérieure" peut utiliser une couche "inférieure" mais pas l'inverse. Quelques exemples afin de rendre ce point un peu plus concret : 
    - L'entité "Décision de justice" ne pourra pas interagir directement avec la base de données (les entités d'ORM ne sont donc pas des entités métier). 
    - L'interaction avec une base de données doit être interfacée et injectée à la couche `Use Case` : l'injection d'une dépendance technique permet, en cas d'évolution de cette dépendance technique, de ne pas impacter la logique métier. Seule la couche `Infrastructure` sera impactée. 
    - Les fonctionnalités du framework sont utilisées uniquement dans la couche `Infrastructure`. Les couches `Use cases` et `Entities` sont totalement agnostiques du framework, facilitant leur maintenance dans le temps

## Décision
Nous choisissons de nous inspirer des principes de Clean Architecture afin de structurer les différentes responsabilités du code produit par l'équipe. Trois dossiers seront créés pour intégrer ces principes : 
- `domain` pour les entités métiers 
- `usecase` pour les cas d'usages
- `infrastructure` pour l'exposition et la gestion des dépendances externes 

