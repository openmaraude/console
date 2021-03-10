FROM node

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --production

COPY . /app/

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]
