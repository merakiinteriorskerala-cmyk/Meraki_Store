FROM node:20-alpine

WORKDIR /app/meraki-storefront

COPY package.json yarn.lock ./

# Install dependencies (using yarn since yarn.lock exists)
RUN yarn install --frozen-lockfile

COPY . .

# Build the application
# Note: NEXT_PUBLIC_ variables from .env.local (if present) or args are needed here
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# Set default values for build if not provided
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL:-http://backend:9000}
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL:-http://backend:9000}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-http://localhost:8000}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}

# Expose port 8000
EXPOSE 8000

CMD ["yarn", "dev"]