FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app will run on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]