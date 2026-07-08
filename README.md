# 🎮 GameVault

GameVault is a full-stack, responsive gaming storefront and library application. It features a React frontend using Zustand for state management, and a robust FastAPI backend connected to PostgreSQL (Neon DB).

![GameVault Preview](https://raw.githubusercontent.com/kiranv739/gamevault-react/main/public/assets/cyberpunk.jpg) *(Replace with actual application screenshot)*

## ✨ Key Features

- **🔐 Interactive User Authentication**: Register, log in (JWT authenticated), or browse as a guest.
- **⚡ Zustand State Management**: Complete migration to Zustand stores for global auth, cart, library, and toast notification state with persistent localStorage support.
- **🐍 FastAPI Backend API**: Complete Python backend for handling user sessions, games data, cart items, and user libraries.
- **🐘 PostgreSQL Integration**: Relational database persistence hosted on Neon DB with SQL Alchemy ORM.
- **🔍 Game Catalog & Swiper Carousel**: Dynamic showcases featuring trending titles.
- **🏷️ Multi-Category Filtering**: Instant categorization (Action, RPG, Adventure, Shooter, Indie, etc.).
- **🛒 Shopping Bag (Cart) & Personal Library**: Fully operational cart and library systems persisted across user sessions.
- **💳 Fully-Functional Checkout**: Interactive order confirmation flow.
- **📱 Fully Responsive UI**: Custom HSL/RGB colors, modern typography, glassmorphism card layouts, and responsive breakpoints using Bootstrap and Vanilla CSS.

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 18, HTML5, Vanilla CSS
- **State Management**: Zustand (with local persistence)
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **Swiper Engine**: Swiper.js

### Backend
- **Core**: Python 3.8+, FastAPI
- **ORM & Database**: SQLAlchemy, PostgreSQL (Neon DB), `psycopg2-binary`
- **Security**: JWT (`python-jose`), Bcrypt (`passlib`)
- **API Integration**: httpx (integrates with external game data & Groq AI APIs)

---

## 🚀 Getting Started

To run the full-stack project locally, you will need to run both the frontend and the backend.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside the `backend` folder and populate it:
   ```env
   DATABASE_URL='postgresql://your_db_user:your_db_password@your_host/neondb?sslmode=require'
   JWT_SECRET=your_jwt_secret_key
   RAWG_API_KEY=your_rawg_api_key
   GROQ_API_KEY=your_groq_api_key
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can access the interactive Swagger documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend Setup

1. From the project root, install frontend dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm start
   ```
   This opens the frontend at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```text
gamevault-react/
├── backend/             # FastAPI Backend Service
│   ├── routers/         # API Routers (auth, cart, games, library)
│   ├── auth.py          # JWT & Hashing Helpers
│   ├── database.py      # SQLAlchemy connection
│   ├── main.py          # Application entry point
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic Schemas
│   └── requirements.txt # Python package dependencies
├── src/                 # React Frontend
│   ├── components/      # Reusable UI Components
│   ├── data/            # Static configuration arrays
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page Components (Home, Library, Login, etc.)
│   ├── store/           # Zustand state management stores
│   ├── App.js           # Main App component
│   └── index.js         # Frontend entry point
├── .gitignore           # Ignored files (e.g. backend/.env, node_modules)
└── package.json         # Frontend dependencies and scripts
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
