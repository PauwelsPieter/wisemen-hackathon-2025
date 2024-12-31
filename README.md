<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# WISEMEN-NEST-CORE

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Setting up .env

```bash
'Note: during private generation a passphrase is required, this is RSA_PASSPHRASE'
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
cat private.pem | base64 '<-- Your RSA_PRIVATE'
cat public.pem | base64 '<-- Your RSA_PUBLIC'
```

RSA private key
```bash
RSA_PRIVATE = "your private key"
```
RSA public key
```bash
RSA_PUBLIC = "your public key"
```
RSA passphrase
```bash
RSA_PASSPHRASE = "your password"
```

## Running the app

```bash
# watch mode
$ pnpm run start:dev
```

## Test

```bash
# unit tests
$ pnpm run test:run
```
