from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
import models
from routers import auth, games, library, cart, recommend

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all database tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="GameVault API",
    description="Backend API for the GameVault game store",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://gamevault-react-beige.vercel.app/"],  # Allow all origins for development/Vercel, restrict later
    allow_credentials=False,  # Must be False when allow_origins contains "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(games.router, prefix="/games", tags=["Games"])
app.include_router(library.router, prefix="/library", tags=["Library"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommendations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the GameVault API. Use /docs to view Swagger documentation."}
