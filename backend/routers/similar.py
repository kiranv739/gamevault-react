from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import List
from sentence_transformers import SentenceTransformer
from pgvector.sqlalchemy import Vector
from sqlalchemy import func

router = APIRouter()

@router.get("/{game_id}", response_model=List[schemas.GameResponse])
def get_similar_games(game_id: int, db: Session = Depends(get_db)):
    # Fetch the requested game from DB
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
        
    # If game has no embedding yet, generate it
    if game.embedding is None:
        try:
            model = SentenceTransformer('all-MiniLM-L6-v2')
            text = f"{game.title} {game.genre or ''} {game.description or ''}"
            embedding = model.encode(text).tolist()
            game.embedding = embedding
            db.commit()
            db.refresh(game)
        except Exception as e:
            print(f"Error generating embedding for game {game_id}: {e}")
            
    # Query 6 similar games using pgvector cosine distance
    similar = []
    if game.embedding is not None:
        similar = db.query(models.Game).filter(
            models.Game.id != game_id,
            models.Game.embedding != None
        ).order_by(
            models.Game.embedding.cosine_distance(game.embedding)
        ).limit(6).all()
        
    # If similar games found (minimum 3 games), return them.
    # Otherwise, fall back to same-genre games.
    if similar and len(similar) >= 3:
        return similar
    else:
        fallback = db.query(models.Game).filter(
            models.Game.genre == game.genre,
            models.Game.id != game_id
        ).limit(6).all()
        return fallback

@router.post("/generate-embeddings")
def generate_embeddings(db: Session = Depends(get_db)):
    try:
        # Fetch all games that have no embedding yet
        games_to_process = db.query(models.Game).filter(models.Game.embedding == None).all()
        
        if not games_to_process:
            return {"processed_count": 0}
            
        model = SentenceTransformer('all-MiniLM-L6-v2')
        batch_size = 20
        processed_count = 0
        
        for i in range(0, len(games_to_process), batch_size):
            batch = games_to_process[i:i+batch_size]
            texts = [f"{g.title} {g.genre or ''} {g.description or ''}" for g in batch]
            embeddings = model.encode(texts).tolist()
            
            for g, emb in zip(batch, embeddings):
                g.embedding = emb
                
            db.commit()
            processed_count += len(batch)
            
        return {"processed_count": processed_count}
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Embedding generation failed: {str(e)}"
        )
