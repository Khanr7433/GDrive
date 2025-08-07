# GDrive Project

This project has been restructured to separate the frontend and backend:

## Project Structure

```
├── backend/          # Node.js/Express backend
│   ├── app.js        # Main server file
│   ├── package.json  # Backend dependencies
│   ├── config/       # Database and service configurations
│   ├── middlewares/  # Express middlewares
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── uploads/      # File upload directory
└── frontend/         # React frontend (Vite)
    ├── src/          # React source code
    ├── public/       # Static assets
    ├── package.json  # Frontend dependencies
    └── views/        # Old EJS templates (reference)
```

## Getting Started

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

## Migration Notes

- Frontend migrated from EJS templates to React with Vite
- Backend remains Node.js/Express
- Old EJS views are preserved in `frontend/views/` for reference
