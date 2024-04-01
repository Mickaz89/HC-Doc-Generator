## Installation

```bash
$ npm install
```

## Running the app

Create and fill the .env file (Look at the .env.example).

Make sure the Redis server is running on the port you specified.

You will also need to add a service-account.json file at the root of the project (https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console).

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
