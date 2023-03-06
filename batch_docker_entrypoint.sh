#!/bin/sh
set -e 

wget https://db-api-osc-fr1.scalingo.com/api/ca_certificate -O /home/node/mongo_ca.pem

npm run batch:start:prod