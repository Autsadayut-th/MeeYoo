# Node.js Best Practices
Preferred flow: Route -> Middleware -> Controller -> Service -> Repository/Database.
Keep controllers thin and business logic in services.
Use async/await consistently and centralized error handling.
Validate required environment variables at startup.
Never log passwords, tokens, API keys, or sensitive personal information.
Handle graceful shutdown where appropriate.
