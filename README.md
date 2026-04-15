# QR Campaign Starter (React + Node + MongoDB)

A starter project for this flow:

QR Code -> landing page -> collect name and mobile -> ask question -> show completion message + Instagram follow link.

## Stack
- React (Vite)
- Node.js + Express
- MongoDB + Mongoose
- QR code generation with `react-qr-code`

## Features
- Multi-step campaign form
- Mobile-friendly UI
- Validation for name, mobile, and answer
- Save submissions to MongoDB
- Track QR source with query param like `?ref=poster-a`
- Completion screen with Instagram follow button
- Simple admin QR preview page

## Folder structure
- `client/` React app
- `server/` Express API

## Setup

### 1. Server
```bash
cd server
npm install
cp .env.example .env
```

Update `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/qr_campaign
CLIENT_URL=http://localhost:5173
INSTAGRAM_URL=https://instagram.com/yourhandle
```

Run server:
```bash
npm run dev
```

### 2. Client
```bash
cd client
npm install
cp .env.example .env
```

Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CAMPAIGN_SLUG=summer-offer
VITE_INSTAGRAM_URL=https://instagram.com/yourhandle
```

Run client:
```bash
npm run dev
```

## API
### POST `/api/leads`
```json
{
  "name": "Mohamed Suhail",
  "mobile": "9876543210",
  "answer": "Instagram",
  "campaignSlug": "summer-offer",
  "ref": "poster-a"
}
```

## QR usage
Your printed QR should point to something like:

`https://yourdomain.com/campaign/summer-offer?ref=poster-a`

## Deployment
- Client: Vercel / Netlify
- Server: Render / Railway
- DB: MongoDB Atlas

