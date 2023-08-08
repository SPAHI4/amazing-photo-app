#!/bin/bash

# Generate a private key
openssl genpkey -algorithm RSA -out localhost.key

# Create a certificate signing request
openssl req -new -key localhost.key -out localhost.csr

# Create a self-signed certificate
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt

# Decrypt the key
openssl rsa -in localhost.key -out localhost.decrypted.key

# Create private and public PEM files
openssl rsa -in localhost.key -out private.pem
openssl rsa -in localhost.key -pubout -out public.pem