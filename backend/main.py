from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
import models
from routers import auth, games, library, cart, recommend, similar, orders


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Enable pgvector on Neon
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
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
    allow_origins=["https://gamevault-react-beige.vercel.app/","http://localhost:3000"], 
    allow_credentials=True,  # Must be False when allow_origins contains "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(games.router, prefix="/games", tags=["Games"])
app.include_router(library.router, prefix="/library", tags=["Library"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommendations"])
app.include_router(similar.router, prefix="/similar", tags=["Similar Games"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the GameVault API. Use /docs to view Swagger documentation."}
