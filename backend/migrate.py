from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS embedding vector(384)"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS publisher VARCHAR"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS developer VARCHAR"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS release_date VARCHAR"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS esrb_rating VARCHAR"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS platforms VARCHAR"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS min_requirements TEXT"))
    conn.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS recommended_requirements TEXT"))
    conn.execute(text("ALTER TABLE libraries ADD COLUMN IF NOT EXISTS is_purchased BOOLEAN DEFAULT FALSE"))
    conn.commit()
    print("Migration complete")
