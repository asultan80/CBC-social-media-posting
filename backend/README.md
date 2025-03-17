# Backend

This is the backend for the CBC social media project.

## Environment Setup

Create a .env file in this folder (c:\Users\alex6\source\repos\CBC-social-media\backend\.env) with the following parameters:

- TWITTER_API_KEY
- TWITTER_API_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_SECRET
- BLUESKY_HANDLE
- BLUESKY_OAUTH_TOKEN
- REDIS_HOST (default: 127.0.0.1)
- REDIS_PORT (default: 6379)

Obtain these values from your respective social media developer dashboards and your local Redis configuration.

## Running the Backend

To run the backend, use the following command:

```bash
npm start
```

## Testing

To run the tests, use the following command:

```bash
npm test
```