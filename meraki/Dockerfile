FROM node:20-alpine

WORKDIR /app/meraki

# Install git (needed for GitHub-hosted dependencies)
RUN apk add --no-cache git \
    && git config --global url."https://github.com/".insteadOf ssh://git@github.com/ \
    && git config --global url."https://github.com/".insteadOf git@github.com:

# Enable Corepack for Yarn Berry
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install

COPY . .

# Build the application
RUN yarn build

# Expose port 9000
EXPOSE 9000

# Use shell form so we get proper error output
CMD sh -c "echo '=== Running migrations ===' && yarn medusa db:migrate && echo '=== Starting server ===' && node .medusa/server/index.js 2>&1 || (echo '=== SERVER CRASHED WITH EXIT CODE $? ===' && exit 1)"
