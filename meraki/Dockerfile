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

# Check if admin index.html was generated
RUN echo "=== Checking for admin index.html ===" && \
    ls -la .medusa/server/public/admin/index.html 2>/dev/null || \
    (echo "index.html NOT found - listing all HTML files:" && \
     find .medusa/server/public -name "*.html" -type f 2>/dev/null && \
     echo "=== Full public/admin/ root listing ===" && \
     ls -la .medusa/server/public/admin/ 2>/dev/null)

# Expose port 9000
EXPOSE 9000

CMD sh -c "yarn medusa db:migrate && npx medusa start 2>&1"
