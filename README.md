# Smart Campus frontend

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. If importing the full project repository, set **Root Directory** to `smart-campus-management-portal/frontend`. If this frontend folder is its own repository, use the repository root.
3. Choose **Vite**. Use `npm run build` as the build command and `dist` as the output directory. Vercel detects these values automatically for Vite projects.
4. No environment variable is required for the sample portal. To connect live data, add `VITE_API_BASE_URL` with the public backend API URL, including `/api` (for example, `https://your-backend.example.com/api`), then redeploy.

Vercel serves the frontend; it does not run the Spring Boot API or MySQL database. With no `VITE_API_BASE_URL`, the frontend runs a seeded browser demo; sample service requests are saved in that browser only. To use shared MySQL data, deploy the backend and database separately. Set the backend's `APP_CORS_ALLOWED_ORIGINS` to the exact Vercel site origin. The sample demo API is enabled by the backend's `local` and `local-mysql` profiles; a hosted backend must expose that endpoint. Never set the Vercel API URL to `http://localhost:8080/api`: in a visitor's browser, `localhost` means that visitor's own computer.

## Run locally

Run `npm install` and `npm run dev` from this directory. No backend is needed: without `VITE_API_BASE_URL`, the app opens the sample browser demo and stores new service requests in local browser storage. To opt in to the local backend, create `.env.local` with `VITE_API_BASE_URL=http://localhost:8080/api`, then restart Vite.
