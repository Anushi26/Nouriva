# Nouriva

Nouriva is a food-waste reduction web application with a React/Vite frontend and Node/Express + MongoDB backend.

## Project structure

```text
Nouriva/
├── frontend/   # React + Vite application
└── backend/    # Express API + Mongoose
```

## Database

MongoDB is used through Mongoose.

Local:
`mongodb://127.0.0.1:27017/nouriva`

Production: use a MongoDB Atlas connection string in `MONGODB_URI`.

## Images

Food image uploads are previewed immediately in the browser. Personal food inventory supports one image; surplus food supports up to five images. Images are stored as data URLs in MongoDB so no MySQL or local filesystem storage is required. The frontend validates image type/size and compresses surplus images for practical serverless requests.

## Local development

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to the backend API URL, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

See `DEPLOYMENT.md` for MongoDB Atlas, backend deployment, frontend deployment, and environment variables.
