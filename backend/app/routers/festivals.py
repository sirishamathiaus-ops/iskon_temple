"""GET /api/festivals — list and detail with enriched sample data (e.g. Ugadi)."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.content_api import FestivalDetailOut
from app.services.festival_service import get_festival_by_slug, list_festivals

router = APIRouter(prefix="/festivals", tags=["festivals"])


@router.get("", response_model=list[FestivalDetailOut])
@router.get("/", response_model=list[FestivalDetailOut], include_in_schema=False)
def api_list_festivals(db: Session = Depends(get_db)):
    return list_festivals(db)


@router.get("/{slug}", response_model=FestivalDetailOut)
def api_get_festival(slug: str, db: Session = Depends(get_db)):
    festival = get_festival_by_slug(db, slug)
    if not festival:
        raise HTTPException(status_code=404, detail="Festival not found")
    return festival
