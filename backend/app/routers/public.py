import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import ContactSubmission
from app.models.content import HomepageContent
from app.models.darshan import DarshanTiming
from app.models.festival import Festival
from app.models.gallery import GalleryItem
from app.schemas import ContactCreate, FestivalOut, GalleryItemOut, DarshanTimingOut, TempleSettingsOut

router = APIRouter(prefix="/public", tags=["public"])

TEMPLE_SETTINGS_KEY = "temple_settings"


def _temple_settings_dict(db: Session) -> dict:
    row = db.get(HomepageContent, TEMPLE_SETTINGS_KEY)
    if not row:
        return {}
    try:
        return dict(json.loads(row.value_json))
    except (json.JSONDecodeError, TypeError):
        return {}


@router.get("/temple-settings", response_model=TempleSettingsOut)
def public_temple_settings(db: Session = Depends(get_db)):
    data = _temple_settings_dict(db)
    return TempleSettingsOut(upi_qr_url=data.get("upi_qr_url"))


@router.get("/festivals", response_model=list[FestivalOut])
def list_festivals(db: Session = Depends(get_db)):
    return (
        db.query(Festival)
        .order_by(Festival.sort_order, Festival.event_date)
        .limit(100)
        .all()
    )


@router.get("/festivals/{slug}", response_model=FestivalOut)
def get_festival(slug: str, db: Session = Depends(get_db)):
    f = db.query(Festival).filter(Festival.slug == slug).first()
    if not f:
        raise HTTPException(status_code=404, detail="Festival not found")
    return f


@router.get("/festivals-sponsorship/list", response_model=list[FestivalOut])
def festivals_for_sponsorship(db: Session = Depends(get_db)):
    return (
        db.query(Festival)
        .filter(Festival.sponsorship_enabled.is_(True))
        .order_by(Festival.sort_order, Festival.event_date)
        .all()
    )


@router.get("/darshan", response_model=list[DarshanTimingOut])
def list_darshan(db: Session = Depends(get_db)):
    return db.query(DarshanTiming).order_by(DarshanTiming.section, DarshanTiming.sort_order).all()


@router.get("/gallery", response_model=list[GalleryItemOut])
def list_gallery(db: Session = Depends(get_db)):
    return db.query(GalleryItem).order_by(GalleryItem.sort_order, GalleryItem.id).all()


@router.get("/homepage")
def homepage_bundle(db: Session = Depends(get_db)):
    rows = db.query(HomepageContent).all()
    out: dict[str, object] = {}
    for r in rows:
        try:
            out[r.key] = json.loads(r.value_json)
        except json.JSONDecodeError:
            out[r.key] = r.value_json
    return out


@router.post("/contact", status_code=201)
def submit_contact(body: ContactCreate, db: Session = Depends(get_db)):
    c = ContactSubmission(
        name=body.name,
        email=str(body.email),
        phone=body.phone,
        message=body.message,
    )
    db.add(c)
    db.commit()
    return {"id": c.id, "message": "Thank you. We will respond soon."}
