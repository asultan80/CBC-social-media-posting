# CBC Social Media

CBC Social Media is a Dockerized full-stack application that consists of a backend, frontend, and a Redis cache. The project utilizes Docker Compose to manage the application services.

CBC Social Media Posting System allows content producers to post messages, images, and videos to multiple social media platforms (e.g., Twitter, Instagram, Bluesky) through an Angular frontend and a NestJS backend using Bull and Redis for scheduling.

## Project Structure

```
CBC-social-media/
│
├── backend/            # Contains the backend API service
│   ├── .env          # Environment variables for the backend service
│   └── ...existing code...
│
├── frontend/           # Contains the frontend application
│   └── ...existing code...
│
├── docker-compose.yml  # Docker Compose file to orchestrate services
│
└── README.md           # Project overview and instructions
```

## How to Run

1. **Prerequisites**:
   - Docker installed (https://www.docker.com/get-started)
   - Docker Compose installed

2. **Steps**:
   - Open a terminal and navigate to the project root:
     ```bash
     cd c:\Users\alex6\source\repos\CBC-social-media
     ```
   - Build and start the containers:
     ```bash
     docker-compose up --build
     ```

3. **Services**:
   - **backend**: Runs on port 3000 (using Node 20).
   - **frontend**: Built into static files and served via NGINX on port 80.
   - **redis**: Runs on port 6379.

4. **Stopping the Services**:
   ```bash
   docker-compose down
   ```

## Environment Variables Setup

Before running the application, create a .env file for the backend at:
  c:\Users\alex6\source\repos\CBC-social-media\backend\.env

This file should include the following parameters:
- TWITTER_API_KEY (from your Twitter Developer account)
- TWITTER_API_SECRET (from your Twitter Developer account)
- TWITTER_ACCESS_TOKEN (from your Twitter Developer account)
- TWITTER_ACCESS_SECRET (from your Twitter Developer account)
- BLUESKY_HANDLE (your Bluesky handle)
- BLUESKY_OAUTH_TOKEN (from your Bluesky developer credentials)
- REDIS_HOST (e.g., 127.0.0.1)
- REDIS_PORT (e.g., 6379)

## Additional Information

- Customize the environment variables in the `.env` file located in the `backend` folder as per your requirements.
- Use Docker logs to troubleshoot any issues:
  
  ```
  docker-compose logs -f
  ```
  
Enjoy building and running your CBC Social Media application!
