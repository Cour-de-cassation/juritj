#!/bin/sh

### Following https://dev.to/techschoolguru/how-to-create-sign-ssl-tls-certificates-2aai 
### Caution : use -nodes only in dev environment 

## NOTE :  openssl ecrase les fichiers deja existants donc peut etre pas beson de rm
## rm *.pem *.srl

# 1. Generate CA's private key and self-signed certificate 
openssl req -x509 -sha256 -newkey rsa:4096 -days 365 -nodes -keyout ca-key.pem -out ca-cert.pem -subj "/C=FR/ST=Paris/L=Paris/O=MinJu/OU=Cour de cassation/CN=CC/emailAddress=some@mail.com"

# 2. Let's see what's inside the certificate
openssl x509 -in ca-cert.pem -noout -text

# 3. Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout server-key.pem -out server-req.pem -subj "/C=FR/ST=Paris/L=Paris/O=MinJu/OU=Judilibre/CN=CC/emailAddress=some@mail.com"

# 4. Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -sha256 -req -in server-req.pem -days 365 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem

# 5. Let's see what's inside the certificate
openssl x509 -in server-cert.pem -noout -text

# 6. Verifying validity of server certificate
openssl verify -CAfile ca-cert.pem server-cert.pem

# 7. Generate client private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout client-key.pem -out client-req.pem -subj "/C=FR/ST=Paris/L=Paris/O=MinJu/OU=Judilibre Postman/CN=CC/emailAddress=some@mail.com"

# 8. Use CA's private key to sign client CSR and get back the signed certificate
openssl x509 -sha256 -req -in client-req.pem -days 365 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem

# 9. Let's see what's inside the certificate
openssl x509 -in client-cert.pem -noout -text

# 10. Verifying validity of server certificate
openssl verify -CAfile ca-cert.pem client-cert.pem

# 11. Generate another CA's private key and self-signed certificate 
openssl req -x509 -sha256 -newkey rsa:4096 -days 365 -nodes -keyout another-ca-key.pem -out another-ca-cert.pem -subj "/C=FR/ST=Paris/L=Paris/O=MinJu/OU=Cour de cassation/CN=CC2/emailAddress=some@mail.com"

# 12. Generate another client private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout another-client-key.pem -out another-client-req.pem -subj "/C=FR/ST=Paris/L=Paris/O=MinJu/OU=Judilibre Postman/CN=CC2/emailAddress=some@mail.com"
openssl x509 -sha256 -req -in another-client-req.pem -days 365 -CA another-ca-cert.pem -CAkey another-ca-key.pem -CAcreateserial -out another-client-cert.pem
