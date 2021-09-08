#!/bin/bash

rm -rf *.pem *.csr \
  && cfssl gencert -initca ca-csr.json | cfssljson -bare ca - \
  && cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server server.json | cfssljson -bare server \
  && cat server.pem ca.pem > fullchan.pem \
  && mv server-key.pem privkey.pem \
  && rm -rf *.csr ca-key.pem server.pem \
  && cfssl certinfo -cert ca.pem \
  && cfssl certinfo -cert server.pem \

# rm -rf localhost.* \
#   && rm -rf root-ca.* \
#   && openssl req -x509 -nodes -new -sha256 -days 3650 -newkey rsa:2048 -keyout root-ca.key -out root-ca.pem -subj "/C=IR/ST=Tehran/L=Tehran/O=aasaam/CN=aasaam localhost Root CA" -newkey rsa:2048 -keyout root-ca.key -out root-ca.pem -subj "/C=IR/ST=Tehran/L=Tehran/O=aasaam/CN=aasaam localhost Root CA" \
#   && openssl x509 -outform pem -in root-ca.pem -out root-ca.crt \
#   && openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=IR/ST=Tehran/L=Tehran/O=aasaam/CN=*.localhost" \
#   && openssl x509 -req -sha256 -days 3650 -in localhost.csr -CA root-ca.pem -CAkey root-ca.key -CAcreateserial -extfile .domains.ext -out localhost.crt \
#   && cat localhost.crt root-ca.pem > fullchan.pem \
#   && cp root-ca.pem ca.pem \
#   && cp localhost.crt cert.pem \
#   && cp localhost.key privkey.pem \
#   && rm -rf localhost.* \
#   && rm -rf root-ca.* \
