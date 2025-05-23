# API Endpoint Documentation

## Table of Contents

- [Base URL](#base-url)
- [User Endpoints (`/api/user`)](#user-endpoints-apiuser)
- [Nation Endpoints (`/api/nation`)](#nation-endpoints-apination)
- [War Endpoints (`/api/war`)](#war-endpoints-apiwar)
- [Data Models](#data-models)
- [Configuration and Key Helper Modules](#configuration-and-key-helper-modules)

---

This document details the API endpoints for the Nation Forge backend.

## Base URL

All API endpoints are prefixed with `/api`. For example, the user registration endpoint is `/api/user`.

---

## User Endpoints (`/api/user`)

Handles user registration, login, and profile management.

### 1. Create User
- **Method:** `POST`
- **URL:** `/api/user`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **Success (200):** User object.
  ```json
  {
    "_id": "60d5ecf7a6d8b12345abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "token": "somegeneratedtoken",
    "verified": false,
    "__v": 0
  }
  ```
  - **Error (400):** If email already exists.
  ```json
  {
    "msg": "The email test@example.com is already associated with other account"
  }
  ```

### 2. Login User
- **Method:** `POST`
- **URL:** `/api/user/login`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "msg": "Inicio de sesión exitoso",
    "user": {
      "_id": "60d5ecf7a6d8b12345abcdef",
      "username": "testuser",
      "email": "test@example.com",
      "token": "somegeneratedtoken",
      "verified": true
    }
  }
  ```
  - **Error (401):** Incorrect password.
  - **Error (404):** User not found.

### 3. Get User Details
- **Method:** `GET`
- **URL:** `/api/user/profile`
- **Description:** Retrieves details for the logged-in user (requires token in request body).
- **Request Body (example):**
  ```json
  {
    "token": "user_auth_token_here"
  }
  ```
- **Response:**
  - **Success (200):** User object.
  - **Error:** If token is invalid or not provided.

### 4. Verify User
- **Method:** `GET`
- **URL:** `/api/user/verify/:token`
- **Description:** Verifies a user's email using the token sent during registration.
- **URL Parameters:**
  - `token`: The verification token.
- **Response:**
  - **Success (200):**
  ```json
  {
    "msg": "User verified"
  }
  ```
  - **Error (404):** Invalid token.

---

## Nation Endpoints (`/api/nation`)

Handles creation, retrieval, and management of nations.

### Reading Nation Data

#### 1. Get All Nations (Public)
- **Method:** `GET`
- **URL:** `/api/nation`
- **Description:** Retrieves a list of all nations.
- **Response:** Array of nation objects.

#### 2. Get Monthly Winner Nation
- **Method:** `GET`
- **URL:** `/api/nation/monthly`
- **Description:** Retrieves the nation marked as the "monthly winner".
- **Response:** Nation object (name and _id only) or 404 if not found.

#### 3. Get Nations for a Specific User (Simple List)
- **Method:** `GET`
- **URL:** `/api/nation/simple/:userId`
- **Description:** Retrieves a simplified list (name and _id) of nations created by a specific user.
- **URL Parameters:**
  - `userId`: The ID of the user.
- **Response:** Array of nation objects (name and _id).

#### 4. Get All Nations for a Specific User (Full Details)
- **Method:** `GET`
- **URL:** `/api/nation/:userId`
- **Description:** Retrieves all nations with full details created by a specific user.
- **URL Parameters:**
  - `userId`: The ID of the user.
- **Response:** Array of nation objects.

#### 5. Get Nation Details
- **Method:** `GET`
- **URL:** `/api/nation/details/:nationId`
- **Description:** Retrieves detailed information for a specific nation.
- **URL Parameters:**
  - `nationId`: The ID of the nation.
- **Response:** Nation object.

#### 6. Get Nation Creator
- **Method:** `GET`
- **URL:** `/api/nation/details/:nationId/creator`
- **Description:** Retrieves the ID of the user who created the nation.
- **URL Parameters:**
  - `nationId`: The ID of the nation.
- **Response:**
  ```json
  {
    "creatorId": "user_id_here"
  }
  ```

#### 7. Generate Nation Image (Flag)
- **Method:** `GET`
- **URL:** `/api/nation/details/:nationId/generateImage`
- **Description:** Generates and returns an image URL (presumably a flag) for the nation using OpenAI's image generation.
- **URL Parameters:**
  - `nationId`: The ID of the nation.
- **Response:**
  ```json
  {
    "imageUrl": {
        "created": 1700000000, // Example timestamp
        "data": [
            {
                "b64_json": "base64_encoded_image_data_here..."
            }
        ]
    }
  }
  ```
  *(Note: The actual structure of `imageUrl` from `generateOpenAiImage` might differ slightly, this is based on typical OpenAI responses.)*

### Creating Nations

#### 8. Create Nation (Gemini Basic/Advanced)
- **Method:** `POST`
- **URL:** `/api/nation`
- **Description:** Creates a new nation using Google Gemini. Can be basic or advanced based on `advanced` flag.
- **Request Body (Basic):**
  ```json
  {
    "nationName": "Republic of Solara",
    "governmentType": "Democratic Republic",
    "age": "Modern Era",
    "userId": "user_id_who_creates_nation",
    "advanced": false
  }
  ```
- **Request Body (Advanced):**
  ```json
  {
    "nationName": "Empire of Ignis",
    "governmentType": "Monarchy",
    "age": "Medieval Era",
    "userId": "user_id_who_creates_nation",
    "advanced": true,
    "leaderName": "Emperor Varian",
    "politicalStability": "Stable",
    "economicSystem": "Feudalism",
    "currencyName": "Ignian Sol",
    "wealthDistribution": "Highly Unequal",
    "lifeExpectancy": "45",
    "populationGrowth": "1.2%",
    "other": "Optional additional details or context"
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "msg": "Nation created successfully",
    "nation": { /* ...nation object... */ }
  }
  ```
  - **Error (500):** If nation generation or saving fails.

#### 9. Create Random Nation (Gemini)
- **Method:** `POST`
- **URL:** `/api/nation/random`
- **Description:** Creates a new nation with randomly generated details using Google Gemini.
- **Request Body:**
  ```json
  {
    "userId": "user_id_who_creates_nation"
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "msg": "Nation created successfully",
    "nation": { /* ...nation object... */ }
  }
  ```
  - **Error (500):** If nation generation or saving fails.

#### 10. Add Event to Nation
- **Method:** `POST`
- **URL:** `/api/nation/:nationId/events`
- **Description:** Adds a new historical event to a specific nation.
- **URL Parameters:**
  - `nationId`: The ID of the nation.
- **Request Body (Example Event):**
  ```json
  {
    "name": "The Great Harvest Festival",
    "date": "1054BC-08-15", // Example date, format might vary
    "description": "A significant cultural event celebrating a bountiful harvest.",
    "type": "Cultural" // e.g., Political, Economic, Cultural, Military, Disaster
  }
  ```
- **Response:** Updated nation object with the new event.

### Modifying Nations

#### 11. Update Nation
- **Method:** `PUT`
- **URL:** `/api/nation/:id`
- **Description:** Updates details of an existing nation. The user making the request must be the creator of the nation.
- **URL Parameters:**
  - `id`: The ID of the nation to update.
- **Request Body:**
  ```json
  {
    "userId": "user_id_who_owns_the_nation", // For permission check
    "name": "The Renewed Republic of Solara",
    "historicalContext": "Updated historical context...",
    // ... other updatable fields from nationModel ...
    "politicsDetails": { /* ...updated politicsDetails object... */ },
    "economyDetails": { /* ...updated economyDetails object... */ },
    "populationDetails": { /* ...updated populationDetails object... */ }
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "message": "Nación actualizada exitosamente",
    "nation": { /* ...updated nation object... */ }
  }
  ```
  - **Error (403):** Permission denied.
  - **Error (404):** Nation not found.

### Deleting Nations

#### 12. Delete Nation
- **Method:** `DELETE`
- **URL:** `/api/nation/:id`
- **Description:** Deletes a nation. The user making the request must be the creator of the nation.
- **URL Parameters:**
  - `id`: The ID of the nation to delete.
- **Request Body:**
  ```json
  {
    "userId": "user_id_who_owns_the_nation" // For permission check
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "message": "Nación eliminada exitosamente"
  }
  ```
  - **Error (403):** Permission denied.
  - **Error (404):** Nation not found.

---

## War Endpoints (`/api/war`)

Handles the creation and retrieval of war scenarios.

### 1. Create War (Gemini)
- **Method:** `POST`
- **URL:** `/api/war`
- **Description:** Creates a new war scenario between two nations using Google Gemini.
- **Request Body:**
  ```json
  {
    "nationA": "Nation A ID or Name", // Specify how Nation A is identified
    "nationB": "Nation B ID or Name", // Specify how Nation B is identified
    "casusBelli": "Territorial dispute over the Crimson Valley",
    "age": "Modern Era",
    "userId": "user_id_who_initiates_war_simulation",
    "optionalPrompt": "Optional additional context for the war generation"
  }
  ```
- **Response:**
  - **Success (200):**
  ```json
  {
    "msg": "War created successfully",
    "war": { /* ...war object... */ }
  }
  ```
  - **Error (500):** If war generation or saving fails.

### 2. Get Wars for User
- **Method:** `GET`
- **URL:** `/api/war`
- **Description:** Retrieves all wars created by a specific user.
- **Query Parameters:**
  - `userId`: The ID of the user.
- **Response:** Array of war objects.

---
This initial draft covers the main endpoints. I will refine the request/response examples and add more details as needed in subsequent steps.

## Data Models

This section describes the structure of the main data entities used in the Nation Forge API, as defined by Mongoose schemas.

---

### 1. User Model (`models/User.js`)

Represents a user of the application.

```javascript
{
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Implied by controller logic
  },
  password: {
    type: String, // Should be stored hashed in a real application
    required: true
  },
  token: {
    type: String, // Used for email verification and potentially password resets
    default: generateId() // Helper function
  },
  verified: {
    type: Boolean,
    default: false
  }
}
```

---

### 2. Nation Model (`models/nation/nationModel.js`)

Represents a nation created by a user. This is a complex model with several nested sub-schemas.

```javascript
{
  id: { // Note: Mongoose adds _id by default. This 'id' field seems custom.
    type: Schema.Types.UUID,
    default: () => new mongoose.Types.UUID(),
    unique: true,
    required: true
  },
  name: {
    type: String,
    maxLength: 255,
    required: true,
  },
  historicalContext: {
    type: String,
    default: "",
    trim: true
  },
  geopoliticalContext: {
    type: String,
    default: "",
    trim: true
  },
  // These fields seem to be general descriptions, possibly overridden or complemented by the detailed sub-schemas.
  politics: { 
    type: String,
    default: "",
    trim: true
  },
  population: { // General description of population
    type: String,
    default: "",
    trim: true
  },
  historicalCuriosities: {
    type: [String],
    default: []
  },
  importantCharacters: {
    type: [String],
    default: []
  },
  events: [eventSchema], // Array of Event sub-documents
  politicsDetails: {
    type: politicalDetailsSchema, // Sub-document
    required: true
  },
  economyDetails: {
    type: economyDetailsSchema, // Sub-document
    required: true
  },
  populationDetails: { // Contains more structured population data
    type: populationDetailsSchema, // Sub-document
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  creator: { // User ID of the nation's creator
    type: String, // Should ideally be Schema.Types.ObjectId and ref: 'User'
    required: true
  },
  monthlyWinner: { // Flag for a special nation
    type: Boolean,
    default: false
  }
}
```

#### 2.1. Event Sub-Schema (`models/nation/events/eventModel.js`)

Represents a historical or significant event within a nation.

```javascript
// const eventSchema = new Schema({ ... });
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: { // Consider standardizing date format (e.g., ISO 8601)
    type: String, // Storing dates as strings can be problematic for queries/sorting.
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  type: { // e.g., Political, Economic, Cultural, Military, Disaster
    type: String,
    trim: true
  }
}
```

#### 2.2. Political Details Sub-Schema (`models/nation/details/politicalDetails.js`)

Detailed political structure of a nation.

```javascript
// const politicalDetailsSchema = new Schema({ ... });
{
  governmentType: String,
  leaderName: String,
  politicalStability: String, // Could be an enum: e.g., Stable, Unstable, Neutral
  internationalRelations: [{
    nationName: String,
    relationType: String, // e.g., Ally, Enemy, Neutral, Trade Partner
    description: String
  }],
  politicalParties: [{
    name: String,
    ideology: String,
    influence: String // e.g., High, Medium, Low
  }],
  keyPolicies: [String],
  citizenRights: { // Could be a more structured object
    freedomOfSpeech: String, // e.g., Full, Limited, None
    freedomOfPress: String,
    freedomOfAssembly: String,
    // ... other rights
  },
  corruptionLevel: String, // e.g., High, Medium, Low, Very Low
  militaryStrength: String // e.g., Strong, Average, Weak
}
```

#### 2.3. Economy Details Sub-Schema (`models/nation/details/economyDetails.js`)

Detailed economic profile of a nation.

```javascript
// const economyDetailsSchema = new Schema({ ... });
{
  economicSystem: String, // e.g., Capitalism, Socialism, Mixed
  gdp: String, // Gross Domestic Product (consider using Number)
  mainIndustries: [String],
  currencyName: String,
  currencySymbol: String,
  unemploymentRate: String, // (consider using Number with %)
  povertyRate: String, // (consider using Number with %)
  wealthDistribution: String, // e.g., Equitable, Moderately Unequal, Highly Unequal
  naturalResources: [String],
  mainExports: [String],
  mainImports: [String],
  tradePartners: [String]
}
```

#### 2.4. Population Details Sub-Schema (`models/nation/details/populationDetails.js`)

Detailed demographic information of a nation. (Note: The controller code refers to `populationDetails.population` which suggests an additional nesting not directly shown in the schema file but implied by usage in `nationController.js` `createNationGemini` and `createRandomNation` functions: `populationDetails: { population: nationJSON.populationDetails }`. The documentation below reflects the fields *within* that nested `population` object.)

```javascript
// const populationDetailsSchema = new Schema({ population: { ... } });
// Actual fields found within the 'population' sub-object:
{
  populationSize: String, // (consider using Number)
  populationGrowthRate: String, // (consider using Number with %) - also referred to as 'growthRate' in controller
  lifeExpectancy: String, // (consider using Number)
  medianAge: String, // (consider using Number)
  ethnicGroups: [{
    name: String,
    percentage: String // (consider using Number)
  }],
  languages: [{
    languageName: String, // Schema uses 'name', controller uses 'languageName' or 'name'
    percentage: String, // (consider using Number)
    status: String // e.g., Official, Widely Spoken, Minority
  }],
  religions: [{
    religionName: String, // Schema uses 'name', controller uses 'religionName' or 'name'
    percentageAdherents: String, // (consider using Number)
    influence: String // e.g., High, Medium, Low
  }],
  educationLevel: String, // e.g., High Literacy, Moderate Literacy, Low Literacy
  urbanizationRate: String, // (consider using Number with %)
  healthSystemQuality: String // e.g., Good, Average, Poor
}
```
*(Self-correction: The `populationDetailsSchema` in `models/nation/details/populationDetails.js` likely defines the structure of the `population` object itself, not an object that *contains* a `population` object. The controller logic `populationDetails: { population: nationJSON.populationDetails, }` when saving a new nation might be creating an unnecessary nesting if `nationJSON.populationDetails` already matches the `populationDetailsSchema`. For documentation, I will assume `populationDetailsSchema` directly defines these fields, and the controller might have a slight redundancy in how it structures this part before saving.)*

I will clarify the Population Details Sub-Schema structure based on its definition file if I can access it again, or assume the controller's usage implies the final structure in the DB. For now, the fields listed are what Gemini is expected to generate for the `populationDetails` part of a nation.

---

### 3. War Model (`models/War.js` - Assumed)

While `warController.js` imports `generateWarGemini` and implies saving a war object (`const newWar = new War({...}); await newWar.save();`), a `War.js` model file was not explicitly listed in the initial `ls()` output or read. Assuming a schema similar to what `generateWarGemini` would produce based on `warSchema` from `gemini.js`.

**(Placeholder - If a `War.js` model and `warSchema` from `jsonSchemas.js` were available, they would be detailed here. For now, we know it's generated by Gemini and includes at least `creator` and fields based on `warPromptTemplate` and `warSchema`.)**

Example fields (speculative based on `warController.js` and `gemini.js`):
```javascript
{
  // nationA_id: Schema.Types.ObjectId, // Reference to Nation A
  // nationB_id: Schema.Types.ObjectId, // Reference to Nation B
  nationA_name: String, // From req.body.nationA
  nationB_name: String, // From req.body.nationB
  casusBelli: String,   // From req.body.casusBelli
  age: String,          // From req.body.age
  // Fields generated by Gemini based on warSchema:
  warName: String,
  durationYears: Number,
  outcome: String,
  keyEvents: [{
    eventName: String,
    description: String
  }],
  technologicalImpact: String,
  socialImpact: String,
  creator: { // User ID of the war simulation's creator
    type: String, // Should ideally be Schema.Types.ObjectId and ref: 'User'
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}
```

This covers the main data models. Further details on specific enum values or validation rules could be added if needed.

## Configuration and Key Helper Modules

This section outlines important configuration files and helper modules that are central to the application's functionality.

---

### 1. Database Configuration (`config/db.js`)

- **Purpose:** Handles the connection to the MongoDB database.
- **Functionality:**
    - Uses `mongoose` to connect to the MongoDB instance.
    - Reads the MongoDB connection URI from the `MONGO_URI` environment variable (defined in the `.env` file).
    - Logs a success message upon successful connection or an error message if the connection fails, exiting the process on failure.
- **Usage:** Imported and executed in `index.js` to establish the database connection when the application starts.

---

### 2. Gemini AI Configuration and Generation (`config/gemini.js`)

- **Purpose:** Manages interaction with the Google Gemini API and OpenAI API (for image generation) to generate dynamic content for nations and wars.
- **Key Components:**
    - **Initialization:**
        - Initializes `GoogleGenAI` with the `GEMINI_API_KEY` from environment variables.
        - Initializes `OpenAI` with the `OPENAI_API_KEY` for image generation.
    - **Generation Configuration (`generationConfig`):**
        - Defines parameters for the Gemini model like `temperature`, `topP`, `topK`, `maxOutputTokens`, and importantly, `responseMimeType: "application/json"` to request structured JSON output.
    - **Core Generation Functions:**
        - `generateNationGemini(nationConcept, governmentType, age, optionalPrompt)`:
            - Generates basic nation details by making multiple sequential calls to the Gemini API (for base info, politics, economy, population) using specific prompts and schemas.
            - Uses a chat session (`genAI.chats.create`) for contextual conversation.
            - Relies on prompts and system instructions from `helpers/geminiInstructions.js`.
            - Uses schemas from `helpers/jsonSchemas.js` to structure the expected JSON response for different parts of the nation data.
        - `generateNationAdvancedGemini(...)`:
            - Similar to `generateNationGemini` but takes many more parameters for a more detailed and customized nation generation.
            - Uses `nationSystemInstructionAdvanced` and `nationAdvancedPromptTemplate`.
        - `generateNationRandomGemini()`:
            - Generates a nation with randomized characteristics.
            - Uses `nationRandomPromptTemplate` and expects structured output according to `nationSchema`.
        - `generateWarGemini(nationA, nationB, casusBelli, age, optionalPrompt)`:
            - Generates a war scenario. (Note: The code snippet shows `warModel.generateContent` which seems like a typo and might refer to a generic model instance; it likely uses `genAI.models.generateContent` or a chat similar to nation generation, with `warSystemInstruction` and `warPromptTemplate`).
            - Expects structured output based on `warSchema`.
        - `generateOpenAiImage(nationConcept, governmentType, age)`:
            - First, it uses Gemini to generate an appropriate image prompt based on nation details.
            - Then, it calls the OpenAI DALL-E API (`openai.images.generate`) to create an image based on the Gemini-generated prompt.
            - Saves the image locally as `gen.png` (likely for temporary storage or debugging) and returns the OpenAI API response.
    - **JSON Cleaning (`cleanJsonResponse(text)`):**
        - A crucial utility function to preprocess the raw text response from Gemini (when not using strictly enforced schema output for all parts) to make it valid JSON.
        - Handles removal of markdown code blocks (```json ... ```), replaces special quotes, fixes trailing commas, and attempts to repair common JSON errors. This indicates that sometimes the AI's JSON output might not be perfectly formatted.

---

### 3. AI Prompt Instructions (`helpers/geminiInstructions.js`)

- **Purpose:** Contains all the system instructions and prompt templates fed to the Gemini API for various generation tasks.
- **Contents (Examples):**
    - `nationSystemInstruction`, `nationSystemInstructionAdvanced`: General guidelines for Gemini on how to behave when generating nation data.
    - `politicsDetailsPrompt`, `economicDetailsPrompt`, `populationDetailsPrompt`: Specific prompts to ask Gemini for detailed information on these aspects of a nation.
    - `nationPromptTemplate`, `nationAdvancedPromptTemplate`, `nationRandomPromptTemplate`: Templates for constructing the user's initial request for nation generation.
    - `warSystemInstruction`, `warPromptTemplate`: Instructions and templates for generating war scenarios.
    - `nationImageInstruction`: System instruction for generating image prompts.
- **Significance:** This file is critical for shaping the AI's output and ensuring the generated data is relevant and structured as expected.

---

### 4. JSON Schemas for AI (`helpers/jsonSchemas.js`)

- **Purpose:** Defines the JSON schemas that are provided to the Gemini API when requesting structured output (`responseMimeType: "application/json"` and `responseSchema`).
- **Contents (Examples):**
    - `nationSchema`: Defines the expected structure for a whole nation object.
    - `warSchema`: Defines the expected structure for a war object.
    - `politicsSchema`, `economySchema`, `populationSchema`: Define the structures for the detailed political, economic, and demographic sections of a nation.
- **Significance:** These schemas help ensure that the AI's responses are in a predictable JSON format, reducing the need for complex parsing or cleaning (though `cleanJsonResponse` suggests it's still sometimes necessary).

---

### 5. ID Generation (`helpers/generateId.js`)

- **Purpose:** Provides a utility function to generate unique IDs.
- **Functionality:** Likely used for generating default tokens for users (as seen in `models/User.js`). The actual implementation of `generateId()` is not shown but could be based on UUIDs or another randomization method.

This overview should help in understanding how the application is configured and how its key content generation features are implemented.
