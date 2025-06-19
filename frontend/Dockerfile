FROM node:18-alpine as development

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the development server
CMD ["npm", "start"]

# Production build
FROM development as build

RUN npm run build

# Production environment
FROM nginx:alpine as production

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]