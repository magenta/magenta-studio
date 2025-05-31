# Docker Installation

Please refer to the official documentation for Docker installation instructions for your operating system:
https://docker.com/get-started/

## Setting up Node.js Development Environment

### Important Notes:

1. Before running these commands, ensure you have:
   - Node.js installed (the project uses TypeScript 5.0.4, so Node.js 16+ is recommended)
   - Git installed
   - Docker installed and running (Testcontainers requires Docker)

2. Testcontainers is a testing utility that provides lightweight, throwaway instances of common databases, message brokers, and other services in containers for testing.

3. This example demonstrates how to use Testcontainers Cloud with Node.js applications for integration testing.

Would you like me to:
- Check what testing framework and configuration is used in the project?
- Provide more details about the Testcontainers setup?
- Show how to troubleshoot common setup issues?

Please let me know what additional information would be most helpful.

# Pull the Node.js Docker image (using LTS version for stability):
docker pull node:20-alpine

# Create a Node.js container and start a Shell session:
docker run -it --rm --entrypoint sh node:20-alpine

# Verify the Node.js version:
node -v # Should print v20.x.x

# Verify npm version:
npm -v # Should print 10.x.x