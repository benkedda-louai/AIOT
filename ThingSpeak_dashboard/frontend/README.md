# Diabetes Prediction Dashboard - Next.js Frontend

Modern, real-time diabetes prediction dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 **User Authentication** - JWT-based login/signup with 7-day token expiration
- 📊 **Real-time IoT Data** - ThingSpeak sensor data display (Glucose, Blood Pressure, Insulin, etc.)
- 🤖 **ML Prediction** - Diabetes risk prediction using trained Decision Tree model
- ⚡ **Auto-Refresh** - Configurable auto-refresh (5/10/15/30s intervals)
- 🎯 **Auto-Predict** - Automatic predictions when data updates
- 📈 **Prediction History** - Detailed history with statistics
- 🎨 **Modern UI** - Glass morphism design with gradient backgrounds
- 🎉 **Animations** - Conditional animations (balloons for low risk, danger particles for high risk)

## Prerequisites

- Node.js 18+ and npm
- FastAPI backend running on `http://localhost:8000`
- Firebase Realtime Database configured
- ThingSpeak channel configured

## Installation

1. **Install dependencies:**

```bash
cd ThingSpeak_dashboard/frontend
npm install
```

2. **Configure environment variables:**
   The backend API URL is set in `next.config.js`:

```javascript
env: {
  NEXT_PUBLIC_API_URL: 'http://localhost:8000',
}
```

3. **Start development server:**

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (redirects)
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── SensorCards.tsx     # IoT sensor data cards
│   │   ├── PredictionPanel.tsx # Prediction input/results
│   │   └── HistoryTable.tsx    # Prediction history table
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # Axios API client
│   │   └── auth.ts             # Authentication helpers
│   └── types/                  # TypeScript types
│       └── index.ts            # Type definitions
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Pages

### Login (`/login`)

- Username and password authentication
- JWT token storage in localStorage
- Redirects to dashboard on success

### Signup (`/signup`)

- Create new account with username, password, height, weight, age
- Calculates BMI from height/weight
- Automatic login after signup

### Dashboard (`/dashboard`)

- Real-time sensor data from ThingSpeak
- Auto-refresh with configurable intervals
- Auto-predict toggle
- Prediction input (number of pregnancies)
- Prediction results with risk level
- Prediction history table with statistics
- Conditional animations based on risk level

## Components

### SensorCards

Displays 5 sensor data cards:

- Glucose (mg/dL)
- Blood Pressure (mm Hg)
- Skin Thickness (mm)
- Insulin (μU/mL)
- Diabetes Pedigree Function

### PredictionPanel

- Input for number of pregnancies
- Predict button
- Results display with risk level (Low/High)
- Probability percentage
- All features used in prediction

### HistoryTable

- Chronological list of all predictions
- Statistics summary (total, low risk, high risk, avg probability)
- Color-coded rows (green for low risk, red for high risk)
- Detailed feature values

## API Integration

The frontend communicates with FastAPI backend at `http://localhost:8000`:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/thingspeak/latest` - Fetch latest sensor data
- `POST /api/predict` - Make prediction
- `GET /api/predictions/history` - Get prediction history

## Authentication

JWT tokens are stored in localStorage with 7-day expiration. The API client automatically:

- Adds `Authorization: Bearer <token>` header to requests
- Redirects to login on 401 errors
- Removes token on logout

## Styling

- **Tailwind CSS** for utility-first styling
- **Glass morphism** cards with backdrop blur
- **Gradient background** (#667eea to #764ba2)
- **Responsive design** for all screen sizes
- **Custom animations** for balloons and danger particles

## Auto-Refresh

Configure auto-refresh intervals:

- 5 seconds
- 10 seconds (default)
- 15 seconds
- 30 seconds

Toggle auto-predict to automatically run predictions when data updates.

## Animations

### Low Risk (Balloons)

- 20 balloon emojis floating upwards
- Random horizontal positions
- 3-5 second animation duration

### High Risk (Danger Particles)

- 30 red particles falling
- Random horizontal positions
- Rotating animation
- 2-4 second duration

## Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Framer Motion** - Animations (planned)
- **Recharts** - Charts (planned)

## Environment Variables

Set in `next.config.js`:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Notes

- Backend must be running before starting frontend
- Firebase credentials must be configured in backend
- ThingSpeak channel must be active and sending data
- Model file must be present at `/output/models/decision_tree_model.pkl`

## Troubleshooting

**Login not working:**

- Check backend is running on port 8000
- Verify Firebase credentials are configured
- Check browser console for errors

**No sensor data:**

- Verify ThingSpeak channel is active
- Check API keys in backend `.env`
- Verify channel is sending data

**Predictions failing:**

- Ensure model file exists
- Check all required fields are present
- Verify user profile data (height, weight, age)

## License

MIT
