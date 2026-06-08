"""Festival queries and static content merge."""

from datetime import date, datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.festival import Festival
from app.schemas.content_api import FestivalDetailOut, FestivalTimingOut
from app.services.content_data import FESTIVAL_ENRICHMENT


def _festival_to_dict(f: Festival) -> dict[str, Any]:
    return {
        "id": f.id,
        "name": f.name,
        "slug": f.slug,
        "event_date": f.event_date,
        "end_date": f.end_date,
        "short_description": f.short_description,
        "description": f.description,
        "image_url": f.image_url,
        "registration_url": f.registration_url,
        "sponsorship_enabled": f.sponsorship_enabled,
        "is_featured": f.is_featured,
        "sort_order": f.sort_order,
        "created_at": f.created_at,
    }


def enrich_festival(data: dict[str, Any]) -> FestivalDetailOut:
    slug = data["slug"]
    extra = FESTIVAL_ENRICHMENT.get(slug, {})
    timings = [FestivalTimingOut(**t) for t in extra.get("timings", [])]
    gallery = list(extra.get("gallery_images", []))
    if data.get("image_url") and data["image_url"] not in gallery:
        gallery = [data["image_url"], *gallery]
    return FestivalDetailOut(
        **data,
        importance=extra.get("importance"),
        timings=timings,
        gallery_images=gallery,
    )


def list_festivals(db: Session) -> list[FestivalDetailOut]:
    rows = db.query(Festival).order_by(Festival.sort_order, Festival.event_date).limit(100).all()
    by_slug = {f.slug: enrich_festival(_festival_to_dict(f)) for f in rows}

    for slug, extra in FESTIVAL_ENRICHMENT.items():
        if slug not in by_slug and "fallback" in extra:
            fb = extra["fallback"].copy()
            fb.setdefault("created_at", datetime.now(timezone.utc))
            fb.setdefault("registration_url", None)
            fb.setdefault("end_date", None)
            by_slug[slug] = enrich_festival(fb)

    return sorted(by_slug.values(), key=lambda x: (x.sort_order, x.event_date or date.min))


def get_festival_by_slug(db: Session, slug: str) -> FestivalDetailOut | None:
    f = db.query(Festival).filter(Festival.slug == slug).first()
    if f:
        return enrich_festival(_festival_to_dict(f))
    extra = FESTIVAL_ENRICHMENT.get(slug)
    if extra and "fallback" in extra:
        fb = extra["fallback"].copy()
        fb.setdefault("created_at", datetime.now(timezone.utc))
        fb.setdefault("registration_url", None)
        fb.setdefault("end_date", None)
        return enrich_festival(fb)
    return None
