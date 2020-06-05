FROM node:lts as dev

WORKDIR /sapindale

ENV NODE_ENV=development \
  UPHOLSTERY=https://upholstery.canadiana.ca \
  CANTALOUPE=https://image-mamirolle.canadiana.ca/iiif/2 \
  PACKAGING=https://packaging.canadiana.ca \
  API=https://api.canadiana.ca/v1

COPY --chown=node:node package.json yarn.lock webpack.config.js ./
RUN yarn install

# allows sapper dev client to run over https
RUN sed -i 's/http/https/g' node_modules/sapper/sapper-dev-client.js

COPY --chown=node:node src ./src/
COPY --chown=node:node static ./static/

EXPOSE 8080 10000

CMD ["yarn", "run", "dev"]

FROM node:lts as builder

WORKDIR /sapindale

COPY package.json yarn.lock webpack.config.js ./
COPY src ./src/

RUN yarn install

ENV NODE_ENV=production \
  UPHOLSTERY=https://upholstery.canadiana.ca \
  CANTALOUPE=https://image-mamirolle.canadiana.ca/iiif/2 \
  PACKAGING=https://packaging.canadiana.ca \
  API=https://api.canadiana.ca/v1

RUN yarn run build

FROM node:lts-alpine AS prod

WORKDIR /sapindale
RUN chown -R node:node .

USER node

COPY --chown=node:node package.json yarn.lock ./
COPY --from=builder --chown=node:node /sapindale/__sapper__ ./__sapper__/
COPY --chown=node:node static ./static/

RUN yarn install --prod

ENV NODE_ENV=production \
  PORT=8080 \
  UPHOLSTERY=https://upholstery.canadiana.ca \
  CANTALOUPE=https://image-mamirolle.canadiana.ca/iiif/2 \
  API=https://api.canadiana.ca/v1


EXPOSE 8080

CMD ["node", "__sapper__/build"]
