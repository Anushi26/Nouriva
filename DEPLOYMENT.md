# Nouriva deployment

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and database named `nouriva`. Create a database user and allow the deployment service to connect. Copy the Atlas connection string.

Backend environment variables:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/nouriva?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```

## 2. Backend

Deploy the `backend` folder as its own Vercel project. Set the project Root Directory to `backend`.

The backend entry point is `api/index.js`; `vercel.json` is already included.

After deployment, test:

```text
https://YOUR-BACKEND.vercel.app/api/health
```

It should return a JSON health message.

## 3. Frontend

Deploy the `frontend` folder as a separate Vercel project. Set Root Directory to `frontend`.

Add:

```env
VITE_API_URL=https://YOUR-BACKEND.vercel.app/api
```

Redeploy after setting the variable.

## 4. Important

Do not use `mongodb://127.0.0.1:27017/nouriva` in the production backend. That address refers to the deployment server itself. Use MongoDB Atlas for production.

Do not hard-code a production backend URL in React files. `VITE_API_URL` is used throughout the frontend.
