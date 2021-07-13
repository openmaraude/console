# Introduction

Bienvenue sur la documentation de l'API [le.taxi](https://le.taxi/).

L'API le.taxi permet aux artisans taxis d'être présents sur les applications mobiles, et aux clients de trouver simplement et rapidement un chauffeur.

## Définitions

* **Applicatif client (ou moteur de recherche):** client de l'API souhaitant mettre en relation ses usagers avec des taxis.

* **Applicatif chauffeur (ou opérateur):** client de l'API fournnissant la disponibilité et la géolocalisation en temps réel des véhicules en maraude, et recevant les demandes de courses effectuées par les usagers d'un applicatif client.

* **Gestionnaire de flotte:** compte d'un prestataire technique gérant les flottes de plusieurs applicatifs chauffeur.

* **LOM**: loi d'orientation des mobilités. C'est [dans le cadre de l'article L3121-11-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039784232/2020-12-27) que s'inscrit le.taxi, le registre de disponibilité des taxis.

## Inscription

L'accès à l'API est restreint et demande de vous inscrire sur [api.gouv.fr](https://api.gouv.fr/les-api/le-taxi).

Une fois votre inscription validée, vous obtenez un compte sur la console de gestion. La clé d'API disponible sur la section "Mon compte" vous permet d'authentifier vos requêtes. Celle-ci doit rester secrète.


## Environnements

## REST




clé d'API, enregistrement via api.gouv.fr

environnements : prod et dev

REST
-> on suit globalement le REST mais pour des raison de backward compat pas complètement

opensource : lien vers github

documentation de référence générée à partir du code

liste des roles



# Applicatif client

définition : mise en relation avec vos usagers

intro : déroulement
    l'usager cherche un taxi, on liste les taxis proches de lui
    ensuite on sélectionne un taxi et on effectue une demande



1/ lister les taxis autour avec get /taxis

2/ get /taxis/:id? dispo? utile?


3/ reserver une course



