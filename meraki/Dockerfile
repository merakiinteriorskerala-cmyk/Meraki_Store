FROM node:20-alpine

WORKDIR /app/meraki

# Install git (needed for GitHub-hosted dependencies)
RUN apk add --no-cache git

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

CMD ["yarn", "start"]