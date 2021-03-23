FROM node:14
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
ENTRYPOINT ["/bin/sh", "./run.sh"]
