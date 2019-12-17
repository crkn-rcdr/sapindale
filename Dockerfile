FROM node:lts as builder

WORKDIR /sapindale

COPY package.json yarn.lock tailwind.config.js webpack.config.js ./
COPY src ./src/

RUN yarn install

ENV NODE_ENV=production \
  COUCH=https://upholstery.canadiana.ca \
  PACKAGING=https://packaging.canadiana.ca

RUN yarn run build

FROM node:lts-alpine

WORKDIR /sapindale
RUN chown -R node:node .

USER node

COPY --chown=node:node package.json yarn.lock ./
COPY --from=builder --chown=node:node /sapindale/__sapper__ ./__sapper__/
COPY --chown=node:node ssl ./ssl/
COPY --chown=node:node static ./static/

RUN yarn install --prod

ENV NODE_ENV=production \
  SSL_DIR=/sapindale/ssl \
  HTTPS=1 \
  PORT=8443 \
  HTTP_PORT=8080 \
  COUCH=https://upholstery.canadiana.ca

EXPOSE 8443
EXPOSE 8080

CMD ["node", "__sapper__/build"]
