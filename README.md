# Backend de Nation Forge

Esta es la API backend para **Nation Forge**, una plataforma que permite a los usuarios generar, gestionar y simular naciones utilizando modelos avanzados de IA. Utiliza Google Gemini para la generación de texto (historia, política, economía, etc.) y OpenAI para la generación de imágenes.

## 🚀 Características

-   **Generación de Naciones con IA:** Crea naciones detalladas con historia, sistemas políticos, economías y demografía utilizando Google Gemini.
-   **Generación Aleatoria de Naciones:** Genera instantáneamente naciones únicas completamente aleatorias.
-   **Simulación de Guerra:** Simula escenarios de conflicto entre dos naciones con resultados generados por IA.
-   **Generación de Imágenes:** Genera representaciones visuales (banderas/escenas) para las naciones utilizando OpenAI.
-   **Gestión de Usuarios:** Registro seguro de usuarios, inicio de sesión y gestión de perfiles.
-   **Gestión de Naciones:** Edita, elimina y rastrea eventos de tus naciones creadas.

## 🛠️ Stack Tecnológico

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Base de Datos:** MongoDB (con Mongoose)
-   **Modelos de IA:**
    -   Google Gemini (vía `@google/genai`) - Para contenido de texto
    -   OpenAI (vía `openai`) - Para generación de imágenes

## 📋 Prerrequisitos

-   Node.js (v18+ recomendado)
-   Instancia de MongoDB (local o Atlas)
-   Claves API para:
    -   Google Gemini
    -   OpenAI

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio**

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configuración del Entorno**
    Crea un archivo `.env` en el directorio raíz basado en `pattern.env` y añade tus claves API:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/nation-forge
    OPENAI_API_KEY=tu_clave_api_openai
    GEMINI_API_KEY=tu_clave_api_google_gemini
    ```

4.  **Iniciar el Servidor**
    ```bash
    npm start
    ```
    El servidor se iniciará en el puerto especificado en `.env` (por defecto 3000).

## 📡 Endpoints de la API

### 👤 Usuarios (`/api/user`)

| Método | Endpoint | Descripción | Cuerpo/Parámetros |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Registrar un nuevo usuario | `{ "email": "...", "password": "...", "username": "..." }` |
| `POST` | `/login` | Iniciar sesión de usuario | `{ "email": "...", "password": "..." }` |
| `GET` | `/profile` | Obtener detalles del usuario | Cuerpo: `{ "token": "..." }` |
| `GET` | `/verify/:token` | Verificar cuenta de usuario | Param: `token` |

### 🌍 Naciones (`/api/nation`)

| Método | Endpoint | Descripción | Cuerpo/Parámetros |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Obtener todas las naciones | - |
| `GET` | `/monthly` | Obtener nación ganadora mensual | - |
| `GET` | `/simple/:userId` | Obtener lista simplificada de naciones por usuario | Param: `userId` |
| `GET` | `/:userId` | Obtener todas las naciones de un usuario | Param: `userId` |
| `GET` | `/details/:nationId` | Obtener detalles completos de una nación | Param: `nationId` |
| `GET` | `/details/:nationId/generateImage` | Generar imagen IA para nación | Param: `nationId` |
| `GET` | `/details/:nationId/creator` | Obtener ID del creador de una nación | Param: `nationId` |
| `POST` | `/` | Crear una nación (Gemini) | `{ "nationName": "...", "governmentType": "...", "age": "...", "userId": "...", "advanced": boolean, ... }` |
| `POST` | `/random` | Crear una nación aleatoria | `{ "userId": "..." }` |
| `POST` | `/:nationId/events` | Añadir un evento a una nación | Param: `nationId`, Cuerpo: Objeto Evento |
| `PUT` | `/:id` | Actualizar detalles de la nación | Param: `id`, Cuerpo: Objeto Actualizaciones |
| `DELETE` | `/:id` | Eliminar una nación | Param: `id`, Cuerpo: `{ "userId": "..." }` (para verificación de propiedad) |

### ⚔️ Guerras (`/api/war`)

| Método | Endpoint | Descripción | Cuerpo/Parámetros |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Crear un escenario de guerra | `{ "nationA": "...", "nationB": "...", "casusBelli": "...", "userId": "..." }` |
| `GET` | `/` | Obtener guerras de un usuario | Query: `?userId=...` |

## 📂 Estructura del Proyecto

```
├── config/             # Configuración de base de datos e IA
├── controllers/        # Lógica de manejo de solicitudes
├── helpers/            # Funciones de utilidad y prompts
├── models/             # Esquemas de Mongoose (User, Nation, War)
├── routes/             # Definiciones de rutas de la API
├── index.js            # Punto de entrada
└── package.json        # Dependencias y scripts
```