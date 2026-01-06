FROM node:20-alpine

WORKDIR /app/meraki

# Enable Corepack for Yarn Berry
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install --immutable

COPY . .

# Build the application
RUN yarn build

# Expose port 9000
EXPOSE 9000

CMD ["yarn", "start"]