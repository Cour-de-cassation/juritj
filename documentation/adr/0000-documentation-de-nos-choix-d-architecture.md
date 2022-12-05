# Documentation de nos choix d'architecture

Date : 30/11/2022

## Statut

**<span style="color:green">Accepté</span>**

## Contexte

JuriTJ Collect est une nouvelle application de l'API Judilibre ayant pour objectif de collecter des décisions de justice de tribunaux judiciaire. Elle s'inscrit dans le traitement Judilibre qui consiste à collecter, pseudonymiser et publier les décisions de justice en Open Data via l'[API Judilibre](https://api.gouv.fr/les-api/api-judilibre). 
Nous souhaitons documenter nos choix structurants de manière à garder une trace des raisons qui nous ont poussé à prendre nos décisions. 
Ces traces serviront de références dans le temps. 
Elles pourront cependant être remises en question en cas d'évolution du contexte. 

## Décision

Nous mettons en place un dossier d'Architecture Decision Records. Chaque décision donnera lieu à un nouveau fichier `markdown` reprenant la structure du présent document. 
Nos modèles d'inspiration : 
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) de Michael Nygard
- [Architecture et documentation : les ADRs](https://blog.engineering.publicissapient.fr/2019/03/05/architecture-et-documentation-les-adrs/) de Sylvain Decout