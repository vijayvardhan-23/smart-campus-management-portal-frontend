# Smart Campus frontend

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. If importing the full project repository, set **Root Directory** to `smart-campus-management-portal/frontend`. If this frontend folder is its own repository, use the repository root.
3. Choose **Vite**. Use `npm run build` as the build command and `dist` as the output directory. Vercel detects these values automatically for Vite projects.
4. Add the environment variable `VITE_API_BASE_URL` with the public backend API URL, including `/api` (for example, `https://your-backend.example.com/api`), then redeploy.

Vercel serves the frontend; it does not run the Spring Boot API or MySQL database. The backend must be deployed separately and use a reachable MySQL database. Set its `APP_CORS_ALLOWED_ORIGINS` environment variable to the exact Vercel site origin (for example, `https://your-project.vercel.app`). The sample demo API is enabled by the backend's `local` and `local-mysql` profiles; a hosted backend must enable a profile that exposes that endpoint. Never use `http://localhost:8080/api` as the Vercel value: in a visitor's browser, `localhost` means that visitor's own computer.

## Run locally

Create `frontend/.env` from `.env.example` if you need to override the API URL. Start the Spring Boot backend at `http://localhost:8080`, then run `npm install` and `npm run dev` from this directory. The default API URL is `http://localhost:8080/api` during local development.
