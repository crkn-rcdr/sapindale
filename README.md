# sapindale

Svelte/Sapper setup for access platform administration tools. Based on [the webpack template](https://github.com/sveltejs/sapper-template/tree/webpack)

## Docker

`yarn run docker:dev` sets up a development environment that works with our [dev HAProxy config](https://github.com/crkn-rcdr/haproxy). `yarn run docker:prod` builds a production-ready image. Sapindale can also be run directly from your machine, although you will need to ensure environment variables are set.

## Environment variables

- `NODE_ENV`: set to `development` or `production` depending on what mode you'd like the code to run in
- `PORT`: port that the Sapindale server runs on. Defaults to 8080.
- `UPHOLSTERY`: URL for accessing [upholstery](https://github.com/crkn-rcdr/upholstery)
- `CANTALOUPE`: URL for accessing [a Cantaloupe installation](https://github.com/crkn-rcdr/cihm-cantaloupe)
- `API`: URL for accessing the [Canadiana platform API](https://github.com/crkn-rcdr/lapin). Make sure to include the version number.
- `AUTH`: URL for accessing [amsa](https://github.com/crkn-rcdr/amsa)
- `JWT_SECRET`: Secret for signing Canadiana JWTs, as provided in the `auth_token` cookie by amsa
