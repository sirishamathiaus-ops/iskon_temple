from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def ensure_db_schema() -> None:
    """Lightweight additive migrations for dev / small deployments."""
    try:
        insp = inspect(engine)
    except Exception:
        return
    if not insp.has_table("donations"):
        return
    cols = {c["name"] for c in insp.get_columns("donations")}
    if "proof_image_url" in cols:
        return
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE donations ADD COLUMN proof_image_url VARCHAR(512)"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
