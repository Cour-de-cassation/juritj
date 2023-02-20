# Structure du dépôt

Date : 30/11/2022

## Statut

**<span style="color:green">Accepté</span>**

## Contexte

JuriTJ est une nouvelle brique dont la responsabilité est d'intégrer les décisions de Tribunaux Judiciaires au traitement Judilibre. 
A date, 2 applications la composent : l'API JuritTJ Collect et le Batch de normalisation. Pour construire ces 2 applications, nous avons le choix entre un unique dépôt (mono-repo), ou un dépôt par application (multi-repo). 

L'équipe rencontre les contraintes suivantes : 
1. La taille de l'équipe est restreinte 
2. L'équipe utilise des pratiques de développement collaboratif (pair / mob programming)
3. L'équipe souhaite limiter la réplication de certains objets (ex : métadonnées, énumérateurs...)
4. L'équipe souhaite réutiliser aisément certains services d'interactions (ex : interactions avec la DB, interactions avec le bucket S3...)

## Décision
Le mono-repo permet de partager du code à travers plusieurs applications, au sein d'une même base de code. Cet avantage apporte une réponse aux points 3 et 4. 
Le mono-repo peut être problématique en cas de travaux effectués par des équipes cloisonnées : les points 1 et 2 viennent réduire cette problématique. 

Nous choisissons donc, à date, d'utiliser un unique dépôt pour les applications API JuriTJ Collect et Batch de normalisation. Nous notons toutefois que ces applications doivent être séparables aisément à l'avenir : sur ce point, nous comptons sur la modularité apportée par la Clean Architecture (cf ADR 002). 
