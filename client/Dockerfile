# Description: Dockerfile for the client

# Use the official Node.js alpine image which is a small version of Node.js
FROM node:alpine

# Create a directory for the app in the container
RUN mkdir -p /app

# Set the working directory for the app in the container to /app
WORKDIR /app

# Copy dependencies from package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Copy all files to the current directory in the container
COPY ./ ./

# Install dependencies
RUN npm i

# Command to run the app
CMD ["npm", "run", "start"]
