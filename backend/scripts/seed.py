"""
One-time seed: admin user + sample content.
Run from backend directory: PYTHONPATH=. python scripts/seed.py
"""
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

# Ensure backend is on path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.user import AdminUser
from app.models.festival import Festival
from app.models.darshan import DarshanTiming
from app.models.gallery import GalleryItem
from app.models.content import HomepageContent
from app.security import hash_password


def seed(db: Session) -> None:
    admin_user = os.getenv("ADMIN_USERNAME", "admin")
    admin_pass = os.getenv("ADMIN_PASSWORD", "ChangeMeSecure123!")
    if not db.query(AdminUser).filter(AdminUser.username == admin_user).first():
        db.add(AdminUser(username=admin_user, hashed_password=hash_password(admin_pass)))
        print(f"Created admin user '{admin_user}' (change password in production).")

    if db.query(Festival).count() == 0:
        today = date.today()
        samples = [
            Festival(
                name="Sri Krishna Janmashtami",
                slug="janmashtami-2026",
                event_date=today + timedelta(days=30),
                short_description="Grand abhishekam, midnight arati, and prasadam.",
                description="Join us for the most auspicious celebration of the appearance of Lord Sri Krishna.",
                sponsorship_enabled=True,
                is_featured=True,
                sort_order=0,
            ),
            Festival(
                name="Radhashtami",
                slug="radhashtami-2026",
                event_date=today + timedelta(days=60),
                short_description="Srimati Radharani's divine appearance day.",
                description="Special darshan, kirtan, and flower offerings.",
                sponsorship_enabled=True,
                is_featured=True,
                sort_order=1,
            ),
            Festival(
                name="Gaura Purnima",
                slug="gaura-purnima-2026",
                event_date=today + timedelta(days=90),
                short_description="Appearance of Sri Caitanya Mahaprabhu.",
                description="Full day festival with nagara sankirtan and feast.",
                sponsorship_enabled=True,
                is_featured=False,
                sort_order=2,
            ),
        ]
        for f in samples:
            db.add(f)
        print("Seeded sample festivals.")

    if db.query(DarshanTiming).count() == 0:
        timings = [
            DarshanTiming(section="daily_pooja", title="Suprabhatam & Darshan", time_label="4:30 AM – 8:30 AM", sort_order=0),
            DarshanTiming(section="daily_pooja", title="Sringar Darshan", time_label="8:30 AM – 12:00 PM", sort_order=1),
            DarshanTiming(section="daily_pooja", title="Raj Bhoga & Darshan", time_label="12:30 PM – 1:00 PM", sort_order=2),
            DarshanTiming(section="daily_pooja", title="Utthapana & Darshan", time_label="4:15 PM – 8:30 PM", sort_order=3),
            DarshanTiming(section="aarti", title="Mangala Arati", time_label="4:30 AM", sort_order=0),
            DarshanTiming(section="aarti", title="Dhoop Arati", time_label="8:00 AM", sort_order=1),
            DarshanTiming(section="aarti", title="Raj Bhoga Arati", time_label="12:00 PM", sort_order=2),
            DarshanTiming(section="aarti", title="Sandhya Arati", time_label="6:30 PM", sort_order=3),
            DarshanTiming(section="aarti", title="Shayana Arati", time_label="8:30 PM", sort_order=4),
            DarshanTiming(
                section="special",
                title="Sunday Love Feast",
                time_label="1:00 PM – 3:00 PM",
                day_note="Sundays",
                sort_order=0,
            ),
        ]
        for t in timings:
            db.add(t)
        print("Seeded darshan timings.")

    refresh_gallery = os.getenv("SEED_REFRESH_GALLERY", "").lower() in ("1", "true", "yes")
    if refresh_gallery:
        db.query(GalleryItem).delete()
        db.flush()
        print("Cleared gallery (SEED_REFRESH_GALLERY).")

    if db.query(GalleryItem).count() == 0:
        captions = [
            "Hare Krishna Land",
            "Sri Jagannath seva",
            "Annadanam & yatri care",
            "Kirtan & congregation",
            "Festival & procession",
            "Go-seva",
            "Construction & campus",
        ]
        for i in range(1, 46):
            cap = captions[(i - 1) % len(captions)]
            db.add(
                GalleryItem(
                    media_type="image",
                    url=f"/gallery/{i:02d}.png",
                    title=None,
                    caption=cap,
                    sort_order=i,
                )
            )
        print("Seeded 45 gallery images (/gallery/01.png … /gallery/45.png) for the public site.")

    hero = {
        "title": "ISKCON Dornala — Sri Jagannath Temple",
        "subtitle": "Hare Krishna Land on Srisailam Road: darshan, kirtan, annadanam for yatrikas, tribal care, and joyful association.",
        "ctaPrimary": {"label": "Donate Now", "href": "/donate"},
        "ctaSecondary": {"label": "Daily Darshan", "href": "/darshan"},
        "heroImage": "/gallery/01.png",
    }
    featured = {
        "items": [
            {
                "title": "Annadanam & yatrikas",
                "description": "Free prasadam for Srisailam pilgrims and large-scale festival feasts.",
                "href": "/donate",
            },
            {
                "title": "Tribal & village care",
                "description": "Seva and support for neighbouring communities.",
                "href": "/about",
            },
            {
                "title": "Temple construction",
                "description": "Build Sri Jagannath Temple and facilities at Hare Krishna Land.",
                "href": "/donate",
            },
        ]
    }
    intro = {
        "heading": "Sri Jagannath at Hare Krishna Land",
        "body": "Under the guidance of ISKCON and Srila Prabhupada’s teachings, we serve Lord Jagannath, Baladev, and Subhadra with arati, kirtan, and prasadam — while reaching out to pilgrims, school children, and families along the sacred route to Srisailam.",
    }
    darshan_highlight = {
        "quote": "Seeing the Deities in the temple, engaged in various transcendental activities, is called darshan.",
        "attribution": "Srila Prabhupada",
    }

    defaults = [
        ("hero", json.dumps(hero)),
        ("featured_donations", json.dumps(featured)),
        ("temple_intro", json.dumps(intro)),
        ("darshan_highlight", json.dumps(darshan_highlight)),
    ]
    for key, val in defaults:
        row = db.get(HomepageContent, key)
        if row:
            row.value_json = val
        else:
            db.add(HomepageContent(key=key, value_json=val))
    print("Updated homepage blocks: hero, featured_donations, temple_intro, darshan_highlight.")

    db.commit()


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
    print("Done.")


if __name__ == "__main__":
    main()
