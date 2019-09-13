FROM node:10.16

WORKDIR /sapindale
RUN chown -R node:node .

USER node

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --prod

COPY --chown=node:node __sapper__ ./__sapper__/
COPY --chown=node:node ssl ./ssl/
COPY --chown=node:node static ./static/

ENV NODE_ENV=production \
  SSL_DIR=/sapindale/ssl \
  HTTPS=1 \
  PORT=8443 \
  HTTP_PORT=8080 \
  COUCH=https://upholstery.canadiana.ca

EXPOSE 8443
EXPOSE 8080

CMD ["node", "__sapper__/build"]