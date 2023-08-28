# Config package

This package contains all configuration files for the app. It is used by all other packages as a `pnpm` dependency from code or directly by `--import` flag.

Main file is [config.ts](src/config.ts). It uses [envalid](https://github.com/af/envalid) library to validate and parse environment variables.
It has runtime environment variables validation and awesome typescript support.


Configuration is stored in `.env` files in the root directory. There are 3 files, each one overrides previous one:
- `.env.base` - contains base configuration that is used by all environments
- `.env.[DEPLOYMENT]` - contains configuration for specific deployment, e.g. `.env.production` is used for production deployment
- `.env.override` - contains configuration that overrides all other configuration files, it is used for local development and not tracked by git, so it is possible to have different configuration for local development and CI/CD.

This repository is public, so all secrets are stored in github secrets and injected into CI/CD environment. 

`.env` files contain only non-secret configuration, like urls, ports, etc. 

AWS credentials meanwhile are preconfigured in production EC2 instance and are used by `aws-sdk` library.


`safe-config.ts` file contains configuration that could be safely imported and bundled by the client code, containing only non-secret configuration.