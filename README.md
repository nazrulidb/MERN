# Loot Markets

Loot Markets is a web application with a client-server architecture. This README will guide you through setting up and running the project locally.

## Project Structure

-   **client**: Contains the frontend code.
-   **server**: Contains the backend code.

## Prerequisites

Make sure you have the following installed on your machine:

-   Node.js
-   npm (Node Package Manager)

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

MONGO_URI=VALUE PORT=5000
REACT_APP_API_URL=http://localhost:5000

Replace `VALUE` with your actual MongoDB URI.

## Installation

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd loot-markets
    ```

2. **Install dependencies**:
    ```bash
    npm install
    cd client
    npm install
    cd ..
    ```

## Running the Application

To start both the client and server concurrently, run the following command from the root directory:

```bash
npm start

```

This will run the server on http://localhost:5000 and the client on http://localhost:3000.

Scripts
npm run server: Starts the backend server.
npm run client: Starts the frontend development server.
npm start: Runs both the client and server concurrently.
Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License.
