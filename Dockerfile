FROM node:lts AS builder

# Image must be built with --build-arg=<sentry token> to inform sentry of the
# new release.
ARG SENTRY_AUTH_TOKEN

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --production

COPY . /app/

ENV NEXT_TELEMETRY_DISABLED=1

# Build for APITaxi_devel, using default values set in next.config.js.
RUN npm run build
RUN npm run export -- -o /builds/local

# Build for https://dev.api.taxi
ENV API_TAXI_PUBLIC_URL=https://dev.api.taxi
ENV REFERENCE_DOCUMENTATION_URL=${API_TAXI_PUBLIC_URL}/doc
ENV INTEGRATION_ENABLED=true
ENV INTEGRATION_ACCOUNT_EMAIL=neotaxi
RUN npm run build
RUN npm run export -- -o /builds/dev

# Build for https://api.taxi
ENV API_TAXI_PUBLIC_URL=https://api.taxi
ENV REFERENCE_DOCUMENTATION_URL=${API_TAXI_PUBLIC_URL}/doc
ENV INTEGRATION_ENABLED=false
ENV INTEGRATION_ACCOUNT_EMAIL=
RUN npm run build
RUN npm run export -- -o /builds/prod

FROM nginx

EXPOSE 80

RUN mkdir -p /var/www
WORKDIR /var/www

# Copy all builds in /builds
COPY --from=builder /builds/ /builds/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint reads the ${BUILD} environment variable to change the build to
# serve.
ENV BUILD=prod
COPY docker-entrypoint.sh /docker-entrypoint.d/link-console.sh
