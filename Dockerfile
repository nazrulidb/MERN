FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package.json .

RUN npm install

COPY . ./


# Expose the port the app runs on
EXPOSE 5000

# Start the Express server using npm
CMD ["npm", "start"]
