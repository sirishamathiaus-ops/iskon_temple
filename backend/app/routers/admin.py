import json
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import ContactSubmission
from app.models.content import HomepageContent
from app.models.darshan import DarshanTiming
from app.models.donation import Donation
from app.models.festival import Festival
from app.models.gallery import GalleryItem
from app.models.user import AdminUser
from app.schemas import (
    ContactOut,
    DarshanTimingCreate,
    DarshanTimingOut,
    DarshanTimingUpdate,
    DonationOut,
    DonationUpdateAdmin,
    FestivalCreate,
    FestivalOut,
    FestivalUpdate,
    GalleryItemCreate,
    GalleryItemOut,
    HomepageContentOut,
    HomepageContentUpdate,
)
from app.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "static" / "uploads"


def _ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/donations", response_model=list[DonationOut])
def list_donations(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
    skip: int = 0,
    limit: int = 200,
):
    q = db.query(Donation).order_by(Donation.created_at.desc())
    return q.offset(skip).limit(limit).all()


@router.patch("/donations/{donation_id}", response_model=DonationOut)
def update_donation(
    donation_id: int,
    body: DonationUpdateAdmin,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    d = db.get(Donation, donation_id)
    if not d:
        raise HTTPException(status_code=404, detail="Donation not found")
    data = body.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(d, k, v)
    db.commit()
    db.refresh(d)
    return d


@router.get("/festivals", response_model=list[FestivalOut])
def admin_list_festivals(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    return db.query(Festival).order_by(Festival.sort_order, Festival.event_date).all()


@router.post("/festivals", response_model=FestivalOut)
def create_festival(
    body: FestivalCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    if db.query(Festival).filter(Festival.slug == body.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists")
    f = Festival(**body.model_dump())
    db.add(f)
    db.commit()
    db.refresh(f)
    return f


@router.patch("/festivals/{festival_id}", response_model=FestivalOut)
def update_festival(
    festival_id: int,
    body: FestivalUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    f = db.get(Festival, festival_id)
    if not f:
        raise HTTPException(status_code=404, detail="Festival not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(f, k, v)
    db.commit()
    db.refresh(f)
    return f


@router.delete("/festivals/{festival_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_festival(
    festival_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    f = db.get(Festival, festival_id)
    if not f:
        raise HTTPException(status_code=404, detail="Festival not found")
    db.delete(f)
    db.commit()
    return None


@router.get("/gallery", response_model=list[GalleryItemOut])
def admin_gallery(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    return db.query(GalleryItem).order_by(GalleryItem.sort_order, GalleryItem.id).all()


@router.post("/gallery", response_model=GalleryItemOut)
def add_gallery_item(
    body: GalleryItemCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    g = GalleryItem(**body.model_dump())
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


@router.post("/gallery/upload", response_model=GalleryItemOut)
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: str | None = Query(None),
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported")
    _ensure_upload_dir()
    ext = Path(file.filename or "img").suffix or ".jpg"
    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name
    content = await file.read()
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 8MB)")
    dest.write_bytes(content)
    url = f"/static/uploads/{name}"
    g = GalleryItem(media_type="image", url=url, title=title)
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


@router.delete("/gallery/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(
    item_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    g = db.get(GalleryItem, item_id)
    if not g:
        raise HTTPException(status_code=404, detail="Not found")
    if g.url.startswith("/static/uploads/"):
        fn = UPLOAD_DIR / Path(g.url).name
        if fn.exists():
            try:
                fn.unlink()
            except OSError:
                pass
    db.delete(g)
    db.commit()
    return None


@router.get("/darshan", response_model=list[DarshanTimingOut])
def admin_darshan(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    return db.query(DarshanTiming).order_by(DarshanTiming.section, DarshanTiming.sort_order).all()


@router.post("/darshan", response_model=DarshanTimingOut)
def create_darshan(
    body: DarshanTimingCreate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    d = DarshanTiming(**body.model_dump())
    db.add(d)
    db.commit()
    db.refresh(d)
    return d


@router.patch("/darshan/{timing_id}", response_model=DarshanTimingOut)
def update_darshan(
    timing_id: int,
    body: DarshanTimingUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    d = db.get(DarshanTiming, timing_id)
    if not d:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(d, k, v)
    db.commit()
    db.refresh(d)
    return d


@router.delete("/darshan/{timing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_darshan(
    timing_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    d = db.get(DarshanTiming, timing_id)
    if not d:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(d)
    db.commit()
    return None


@router.get("/homepage", response_model=list[HomepageContentOut])
def list_homepage(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    return db.query(HomepageContent).all()


@router.put("/homepage", response_model=HomepageContentOut)
def upsert_homepage(
    body: HomepageContentUpdate,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    try:
        json.loads(body.value_json)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="value_json must be valid JSON")
    row = db.get(HomepageContent, body.key)
    if row:
        row.value_json = body.value_json
    else:
        row = HomepageContent(key=body.key, value_json=body.value_json)
        db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/contacts", response_model=list[ContactOut])
def list_contacts(
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
    unread_only: bool = False,
):
    q = db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc())
    if unread_only:
        q = q.filter(ContactSubmission.is_read.is_(False))
    return q.limit(500).all()


@router.patch("/contacts/{contact_id}/read", response_model=ContactOut)
def mark_contact_read(
    contact_id: int,
    db: Session = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
):
    c = db.get(ContactSubmission, contact_id)
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    c.is_read = True
    db.commit()
    db.refresh(c)
    return c
