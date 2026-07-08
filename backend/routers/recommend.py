import os
import json
import ast
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
from pydantic import BaseModel
from groq import Groq

router = APIRouter()

class RecommendRequest(BaseModel):
    game_ids: List[int]

@router.post("/recommend")
def get_recommendations(
    request: RecommendRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch those games from DB to get their titles and genres
    games = db.query(models.Game).filter(models.Game.id.in_(request.game_ids)).all()
    
    # If no games found in DB, we can't give high quality recommendations.
    # But let's build the list from what we have.
    game_list_str = ", ".join([f"{g.title} ({g.genre or 'Unknown'})" for g in games])
    
    system_prompt = "You are a game recommendation engine. Always respond with valid JSON only. No explanation, no markdown, no backticks."
    user_prompt = f"A user likes these games: {game_list_str}. Recommend 5 similar games with a one-line reason for each. Return ONLY a JSON array in this exact format:\n[\n  {{\n    'title': 'Game Title',\n    'genre': 'Genre',\n    'reason': 'One line reason why they would like this'\n  }}\n]"
    
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set")
            
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        result = response.choices[0].message.content
        
        # Clean the response content
        cleaned_result = result.strip()
        if cleaned_result.startswith("```"):
            lines = cleaned_result.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            cleaned_result = "\n".join(lines).strip()
            
        # Parse JSON. Try standard json first, then ast.literal_eval if it has single quotes or other Python syntax.
        try:
            recommendations = json.loads(cleaned_result)
        except json.JSONDecodeError:
            try:
                recommendations = ast.literal_eval(cleaned_result)
            except Exception:
                raise ValueError("JSON parsing failed")
                
        # Confirm it is a list
        if not isinstance(recommendations, list):
            raise ValueError("Recommendations format is not a list")
            
        return recommendations
        
    except Exception as e:
        print(f"Recommendation service error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Recommendation service unavailable"
        )
