# Nation Forge Backend

## Overview

Nation Forge is a backend API for a game where users can create, manage, and simulate interactions between nations. It allows for dynamic generation of nation details, historical events, and geopolitical contexts, leveraging AI for content creation. Users can also simulate wars between nations.

## Key Features

- User authentication and management.
- CRUD operations for nations.
- AI-powered generation of nation details (politics, economy, population, history) using Google Gemini.
- Generation of war scenarios and outcomes.
- Event tracking for nations.
- Monthly "winner" nation feature.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **AI Content Generation:** Google Gemini API, OpenAI API (for image generation)
- **Authentication:** Token-based (custom implementation)
- **Development:** Nodemon for automatic server restarts

## Project Structure

The project follows a standard Node.js MVC-like pattern:

- `config/`: Database and AI service configurations.
- `controllers/`: Request handlers and business logic.
- `models/`: Mongoose schemas defining the data structures.
- `routes/`: API route definitions.
- `helpers/`: Utility functions and AI prompt instructions.
- `index.js`: Application entry point.

## Setup and Running

1.  **Prerequisites:**
    *   Node.js (version specified in `package.json` or latest LTS)
    *   MongoDB instance (local or cloud-hosted)
    *   API keys for Google Gemini and OpenAI.

2.  **Installation:**
    ```bash
    git clone <repository_url>
    cd nation-forge-backend
    npm install
    ```

3.  **Configuration:**
    *   Create a `.env` file in the root directory based on `pattern.env`.
    *   Fill in the required environment variables:
        *   `PORT`: Port for the server (e.g., 5000)
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `GEMINI_API_KEY`: Your Google Gemini API key.
        *   `OPENAI_API_KEY`: Your OpenAI API key.

4.  **Running the Application:**
    *   For development (with auto-restart):
        ```bash
        npm run dev
        ```
    *   For production:
        ```bash
        npm start
        ```

The API will then be accessible at `http://localhost:PORT` (or the port you specified).

## Project Documentation

Detailed API and technical documentation can be found in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
