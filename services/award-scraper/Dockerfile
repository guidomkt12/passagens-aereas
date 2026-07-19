FROM mcr.microsoft.com/playwright:v1.51.1-noble
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
ENV PORT=3001
CMD ["npm","run","dev"]
