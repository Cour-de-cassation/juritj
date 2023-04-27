#!/bin/sh

cd ./secrets
sh generate-keys.sh
cd ..

node dist/api/main