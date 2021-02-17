---
title: Exemples
slug: examples
---

##### Exemples

Cette page regroupe des exemples de requêtes sur lesquels vous pouvez vous
baser pour développer votre application.

###### Exemples utiles pour les moteurs de recherche

**Lister les taxis**

```shell
$> curl 'api.taxi/taxis/?lat=48.8&lon=2.3' \
  -X GET                                   \
  -H "X-API-KEY: XXX"
```

**Créer une demande de course**

```shell
$> curl 'api.taxi/hails/:hail_id/'                \
    -X POST                                       \
    -H "Content-Type: application/json"           \
    -H "X-API-KEY: XXX"                           \
    -d '
{
  "data": [{
    "customer_address": "customer address",
    "customer_id": "0656435678",
    "customer_lat": 48.8,
    "customer_lon": 2.3,
    "customer_phone_number": "0656435678",
    "operateur": "operator",
    "taxi_id": "taxi_id"
  }]
}'
```

**Changer le statut d'un taxi à accepted_by_customer**

```shell
$> curl 'api.taxi/hails/hail_id/'          \
    -X PUT                                 \
    -H "Content-Type: application/json"    \
    -H "X-API-KEY: XXX"                    \
    -d '
{
  "data": [{
    "status": "accepted_by_customer"
  }]
}'
```

###### Exemples utiles pour les opérateurs

**Libérer un taxi**

```shell
$> curl 'api.taxi/taxis/:taxi_id/'      \
    -X PUT                              \
    -H "Content-Type: application/json" \
    -H "X-API-KEY: XXX"                 \
    -d '
{
  "data": [{
    "status": "free"
  }]
}'
```

**Changer le statut d'un taxi à received_by_taxi**

```shell
$> curl 'api.taxi/hails/:hail_id/'      \
    -X PUT                              \
    -H "Content-Type: application/json" \
    -H "X-API-KEY: XXX"                 \
    -d '{
  "data": [{
    "status": "received_by_taxi"
  }]
}'
```
