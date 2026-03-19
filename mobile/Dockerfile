# Use an official Node.js runtime as a base image
FROM node:22.11.0-alpine

# Install essential tools for React Native and Android development
RUN apk add --no-cache bash openjdk17 git

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies using npm
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure Metro bundler is accessible
ENV PATH=$PATH:/app/node_modules/.bin

# Expose the Metro bundler's default port
EXPOSE 8081

# Start the Metro bundler
CMD ["npm", "start"]
