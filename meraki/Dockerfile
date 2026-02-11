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

# Debug: show what's in the admin build directory
RUN echo "=== .medusa/server/public contents ===" && \
    find .medusa/server/public -type f 2>/dev/null | head -20 || echo "No public directory found"

# Expose port 9000
EXPOSE 9000

CMD sh -c "yarn medusa db:migrate && npx medusa start 2>&1"
