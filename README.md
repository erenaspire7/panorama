# Panorama

Panorama is a web application that harnesses the power of Artificial Intelligence to create questions, flashcards, and feedback based on user-provided content. It goes beyond just generating questions; Panorama also compiles a curated list of additional reading materials to enhance your learning experience.

## Prerequisities
Before you embark on your Panorama journey, make sure you have the following tools and services set up:

- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis Server](https://redis.io/download/)
- Node.js v18.16.0
- Python v3.10.11
- AWS S3
- [Google Programmable Search Console](https://developers.google.com/custom-search/v1/overview)

## API Setup

To get started with the Panorama API, follow these steps:

1. Open your preferred terminal and navigate to the api folder:

    ```
    cd api && npm i -D
    ```

2. Create an .env file within the api folder and add the local database URL. Be sure to replace the environmental variables with the correct keys:

    ```
    DATABASE_URL="postgresql://{user}:{password}@{host}:{port}/{dbname}"
    REDIS_URL=redis://localhost:6379
    JWT_TOKEN_SECRET=mysecret
    JWT_TOKEN_LIFE=900s
    JWT_REFRESH_SECRET=refreshsecret
    JWT_REFRESH_TOKEN_LIFE=3600s
    API_URL=http://localhost:4000
    AWS_ACCESS_KEY_ID=myawsaccesskey
    AWS_SECRET_ACCESS_KEY=myawssecretaccesskey
    ```

3. Run migrations to synchronize your database with the project schema:

    ```
    npx prisma migrate dev
    ```

4. Ensure that the Redis server is running before starting the API:

    ```
    npm run dev
    ```

## Python Layer Setup

Setting up the Python layer is the next step in your Panorama setup:

1. In a new terminal, navigate to the python-layer folder and create a virtual environment:

    ```
    cd python-layer && python -m venv venv
    ```

2. Activate the virtual environment and install all the dependencies from the requirements.txt file:

    ```
    source venv/bin/activate && pip install -r requirements.txt
    ```

3. Create an .env file in the python-layer folder and configure it with the following details:

    ```
    REDIS_HOST=localhost
    REDIS_PORT=6379
    # Leave empty if no password
    REDIS_PASS=''
    OPENAI_KEY=your_open_ai_key
    DATABASE_URL="postgresql://{user}:{password}@{host}:{port}/{dbname}"
    API_URL=http://localhost:4000
    GOOGLE_API_KEY=your_google_api_key
    GOOGLE_CSE_ID=your_google_programmable_console_id
    AWS_ACCESS_KEY_ID=myawsaccesskey
    AWS_SECRET_ACCESS_KEY=myawssecretaccesskey
    ```

4. Finally, run the Python layer:

    ```
    python app.py
    ```

## UI Setup

The final piece of the Panorama puzzle is setting up the user interface:

1. In a new terminal, navigate to the ui folder and install all the required dependencies:

    ```
    cd ui && npm i -D
    ```

2. Start the application:

    ```
    npm run dev
    ```

## Congratulations! Explore the App

With all the components set up, you are now ready to explore Panorama. Enjoy the power of AI-generated questions and curated reading materials to enhance your learning experience. Happy learning!