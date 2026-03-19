# Use an official Node.js runtime as a base image
FROM node:22.11.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application using npm run build
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to start the application
CMD ["node", "dist/main.js"]