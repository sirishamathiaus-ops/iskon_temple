"""GET /api/deities — Sri Jagannath, Baladev & Subhadra worship timetable."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.darshan import DarshanTiming
from app.schemas.content_api import DeitiesTimetableOut, DeityTimingOut
from app.services.content_data import DEFAULT_DEITY_TIMINGS

router = APIRouter(prefix="/deities", tags=["deities"])


@router.get("", response_model=DeitiesTimetableOut)
@router.get("/", response_model=DeitiesTimetableOut, include_in_schema=False)
def deities_timetable(db: Session = Depends(get_db)):
    rows = db.query(DarshanTiming).order_by(DarshanTiming.section, DarshanTiming.sort_order).all()

    if rows:
        timings = [
            DeityTimingOut(
                section=r.section,
                title=r.title,
                time_label=r.time_label,
                day_note=r.day_note,
            )
            for r in rows
        ]
    else:
        timings = [DeityTimingOut(**t) for t in DEFAULT_DEITY_TIMINGS]

    return DeitiesTimetableOut(
        title="Sri Jagannath, Baladev & Subhadra",
        subtitle="Daily darshan and arati at ISKCON Dornala — Hare Krishna Land",
        deities=["Sri Jagannath", "Sri Baladev", "Srimati Subhadra"],
        timings=timings,
        note="Timings may be updated for festivals — confirm with the temple office before travelling.",
    )
