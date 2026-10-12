# Smart Campus frontend

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. If importing the full project repository, set **Root Directory** to `smart-campus-management-portal/frontend`. If this frontend folder is its own repository, use the repository root.
3. Choose **Vite**. Use `npm run build` as the build command and `dist` as the output directory. Vercel detects these values automatically for Vite projects.
4. To connect live data, add the environment variable `VITE_API_BASE_URL` with the public backend API URL, including `/api` (for example, `https://your-backend.example.com/api`), then redeploy. If this variable is not set, the site opens a seeded browser demo automatically.

Vercel serves the frontend; it does not run the Spring Boot API or MySQL database. The browser demo includes sample student and campus records, and service requests created in it are saved in that browser only. To use shared MySQL data, deploy the backend and database separately. Set the backend's `APP_CORS_ALLOWED_ORIGINS` to the exact Vercel site origin. The sample demo API is enabled by the backend's `local` and `local-mysql` profiles; a hosted backend must expose that endpoint. Never use `http://localhost:8080/api` as the Vercel value: in a visitor's browser, `localhost` means that visitor's own computer.

## Run locally

Create `frontend/.env` from `.env.example` if you need to override the API URL. Start the Spring Boot backend at `http://localhost:8080`, then run `npm install` and `npm run dev` from this directory. The default API URL is `http://localhost:8080/api` during local development.
