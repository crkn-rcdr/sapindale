FROM node:lts as builder

WORKDIR /sapindale

COPY package.json yarn.lock tailwind.config.js webpack.config.js ./
COPY src ./src/

RUN yarn install

ENV NODE_ENV=production \
  UPHOLSTERY=https://upholstery.canadiana.ca \
  CANTALOUPE=https://image-mamirolle.canadiana.ca/iiif/2 \
  PACKAGING=https://packaging.canadiana.ca \
  API=https://api.canadiana.ca

RUN yarn run build

FROM node:lts-alpine

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
  API=https://api.canadiana.ca


EXPOSE 8080

CMD ["node", "__sapper__/build"]
