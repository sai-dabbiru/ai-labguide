# Interactive Lab Guide — Deployment Guide

This document outlines the steps required to deploy the full-stack Interactive Lab Guide application (React + Node.js/Express) to a production environment.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PM2 (optional, but highly recommended for managing the Node.js process)

## 1. Preparing the Frontend for Production

The frontend is built using Vite and needs to be compiled into static files for production.

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Build the application for production:
   ```bash
   npm run build
   ```
   *This command creates a `dist/` directory containing your optimized HTML, JS, and CSS files.*

## 2. Serving the Application

There are generally two approaches to deploying this stack:

### Approach A: Integrated Server (Recommended for simplicity)

In this approach, we update the backend Express server to serve the frontend's static files. This means you only need to run one service on your production server.

1. **Update `server/index.js`**
   Add the following lines to your `server/index.js` below your API routes:

   ```javascript
   import path from 'path';
   import { fileURLToPath } from 'url';

   // Get the directory name using ES modules
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   // Serve static files from the React app (assuming server and client are parallel folders)
   app.use(express.static(path.join(__dirname, '../client/dist')));

   // The "catchall" handler: for any request that doesn't match an API route, 
   // send back React's index.html file.
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });
   ```

2. **Run the Node server**
   You can run the server directly or use a process manager like PM2. Follow the "Running the Backend" section below.

### Approach B: Standard Reverse Proxy (Nginx / Apache)

In this approach, Nginx serves the React static files directly and proxies API requests to your Node.js backend.

1. **Backend:** Start the Node.js Express server on port 3001 using PM2.
2. **Frontend:** Point Nginx to your `client/dist` folder to serve the static content.
3. **Nginx Configuration:** Proxy all `/api` requests to `http://localhost:3001`.

*Sample Nginx Config Block:*
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve the React application
    location / {
        root /path/to/InteractiveLabGuide/client/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html; # For React Router
    }

    # Proxy API requests to the Node.js backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 3. Running the Backend (Production)

The backend uses `sql.js` (an in-memory SQLite implementation that saves to a physical file `data.db`).

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install production dependencies:
   ```bash
   npm install --omit=dev
   ```
3. Ensure the backend has environment access to write the `data.db` file.

**Using PM2 (Recommended):**
PM2 ensures your application stays online, restarts on failure, and handles logs.

1. Install PM2 globally:
   ```bash
   npm install pm2 -g
   ```
2. Start the API server:
   ```bash
   pm2 start index.js --name "lab-guide-api"
   ```
3. Save the PM2 configuration so it restarts on system reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

## 4. Important Production Considerations

- **Database Persistence (`sql.js`):** The current backend uses `sql.js` to persist data by writing the entire database buffer to `data.db` on every update. While fine for a single person learning lab, if you deploy this for many concurrent users, you may encounter file-locking or memory overhead issues. For a highly trafficked production environment, consider swapping `sql.js` for the `sqlite3` or `better-sqlite3` native packages.
- **Port Handling:** By default, the server binds to port `3001`. You can modify `server/index.js` to accept a port from the environment: 
  `const PORT = process.env.PORT || 3001;`
- **Security:** Consider adding packages like `helmet` (for HTTP headers) and configuring strict `cors` rules in `server/index.js` before public deployment.
