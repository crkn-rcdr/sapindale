# sapindale

Svelte/Sapper setup for access platform administration tools. Based on [the webpack template](https://github.com/sveltejs/sapper-template/tree/webpack)

## Docker

`yarn run docker:dev` sets up a development environment that works with our [dev HAProxy config](https://github.com/crkn-rcdr/haproxy). `yarn run docker:prod` builds a production-ready image. Sapindale can also be run directly from your machine, although you will need to ensure environment variables are set.

## Environment variables

### Current

- `NODE_ENV`: set to `development` or `production` depending on what mode you'd like the code to run in
- `PORT`: port that the Sapindale server runs on. Defaults to 8080.
- `CANTALOUPE`: URL for accessing [a Cantaloupe installation](https://github.com/crkn-rcdr/cihm-cantaloupe)
- `COUCH`: URL for accessing the Couch installation running on the same server as Sapindale
- `AUTH`: URL for accessing [amsa](https://github.com/crkn-rcdr/amsa)
- `JWT_SECRET`: Secret for signing Canadiana JWTs, as provided in the `auth_token` cookie by amsa

### Deprecated

These variables will no longer be required in future updates.

- `UPHOLSTERY`: URL for accessing [upholstery](https://github.com/crkn-rcdr/upholstery)
- `API`: URL for accessing the [Canadiana platform API](https://github.com/crkn-rcdr/lapin). Make sure to include the version number.

## Development

Starting in 2021, Sapindale client requests that fetch or update data are now expected to only talk to the Sapindale server. We can use [Sapper server routes](https://sapper.svelte.dev/docs#Server_routes) to facilitate this. The `src/routes` directory contains two types of files: `.svelte` files for the route's Svelte component, and `.json.js` files for server JSON requests. The Svelte components can tell, effectively, whether they're being rendered on the server or running on the client, and will fetch resources from server routes accordingly. The best examples for how this works is in `src/routes/collection`. Route components can fetch data from the server using `this.fetch()`; see `src/routes/collection/index.svelte` for an example.

Server routes are thin layers on top of logic found in the `src/models` directory. A server route is expected to finalize its response by calling `res.finalizeJSON(response)`, where `response` is an object with these fields:

- `status`: the HTTP status code
- `content`: the JSON-serializable content of the response
- `message`: if the response has a 400x/500x code, a string explaining the error

`src/resources/couch.js` contains code responsbile for making Couch requests. If a particular operation happens frequently in model code, it should be abstracted into a method in this file, or elsewhere in the `src/resources` directory.

The "old" ways of processing Couch/API requests are still available so as to keep legacy code running; ideally legacy code should be updated to work with the new system as soon as possible.
