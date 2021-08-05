# prenetics-backend-assignment

# Development
* `npm ci` -- Install dependencies
* `npm run watch` -- Watch 
* `npm run build` -- Build
* `npm run test` -- Test
* `npm audit` -- Audit
* `npm run dev` -- Run locally as node process, note that a local postgres instance must be set up and its hostname must be updated at `src/resource/api.json` 

# Docker Deployment
* `docker-compose up -d --build` -- Build and set up postgres and service
* `docker-compose down --rmi all` -- Shutdown and clean up

