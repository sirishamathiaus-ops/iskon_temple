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


def _fest_gallery(i: int) -> str:
    """Festival cards use gallery slots 12–19 (unique vs hero, seva, home strip, full gallery)."""
    slot = 12 + (i % 8)
    return f"/gallery/{slot:02d}.png"


def seed_festivals(db: Session) -> None:
    existing = {f.slug for f in db.query(Festival).all()}
    today = date.today()
    rows: list[Festival] = [
        Festival(
            name="Sri Krishna Janmashtami",
            slug="janmashtami-2026",
            event_date=today + timedelta(days=28),
            short_description="Grand abhishekam, midnight arati, kirtan, and sanctified feast.",
            description="The most auspicious celebration of the divine appearance of Lord Sri Krishna — join us for abhishekam, children’s dramas, and harinama sankirtan through the night.",
            image_url=_fest_gallery(0),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=0,
        ),
        Festival(
            name="Balarama Jayanti",
            slug="balarama-jayanti-2026",
            event_date=date(2026, 8, 28),
            short_description="Appearance of Lord Balarama — abhishekam, kirtan, and maha prasadam.",
            description="Celebrate the divine appearance of Lord Balarama, the elder brother of Sri Krishna and the original spiritual master. Join us for special darshan, abhishekam, kirtan, and prasadam at Hare Krishna Land.",
            image_url=_fest_gallery(0),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=2,
        ),
        Festival(
            name="Gaura Purnima",
            slug="gaura-purnima-2026",
            event_date=today + timedelta(days=55),
            short_description="Appearance of Sri Caitanya Mahaprabhu — the golden avatar of kirtan.",
            description="Full day festival with nagara sankirtan, class on Sri Caitanya-caritamrita, and maha prasadam.",
            image_url=_fest_gallery(1),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=1,
        ),
        Festival(
            name="Radhashtami",
            slug="radhashtami-2026",
            event_date=today + timedelta(days=72),
            short_description="Divine appearance of Srimati Radharani — flower shower and special darshan.",
            description="Special arati, kirtan glorifying Srimati Radharani, and offerings of flowers and bhoga.",
            image_url=_fest_gallery(2),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=2,
        ),
        Festival(
            name="Narasimha Chaturdashi",
            slug="narasimha-chaturdashi-2026",
            event_date=today + timedelta(days=40),
            short_description="Lord Narasimhadeva’s appearance — protective arati and evening kirtan.",
            description="Observe fasting where able, join us for abhishekam and spirited kirtan glorifying Prahlada-Narasimha.",
            image_url=_fest_gallery(3),
            sponsorship_enabled=True,
            is_featured=False,
            sort_order=3,
        ),
        Festival(
            name="Rama Navami",
            slug="rama-navami-2026",
            event_date=today + timedelta(days=95),
            short_description="Appearance of Lord Sri Ramachandra — noon abhishekam and recitation from Ramayana.",
            description="Celebrate Maryada Purushottama Sri Rama with special darshan, readings, and prasadam.",
            image_url=_fest_gallery(4),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=4,
        ),
        Festival(
            name="Govardhan Puja",
            slug="govardhan-puja-2026",
            event_date=today + timedelta(days=180),
            short_description="Annakut offering and remembrance of Krishna lifting Govardhana Hill.",
            description="Hundreds of preparations offered to Sri Sri Jagannath — community feast and harinama.",
            image_url=_fest_gallery(5),
            sponsorship_enabled=True,
            is_featured=False,
            sort_order=5,
        ),
        Festival(
            name="Vaishnava Ekadashi observance",
            slug="ekadashi-observance",
            event_date=None,
            short_description="Monthly fasting for Hari — increased japa, hearing, and simple prasadam.",
            description="Ekadashi occurs twice in a lunar month. Join mangala arati and Bhagavatam class; confirm parana times with the temple calendar.",
            image_url=_fest_gallery(6),
            sponsorship_enabled=False,
            is_featured=False,
            sort_order=6,
        ),
        Festival(
            name="Ugadi",
            slug="ugadi-2026",
            event_date=date(2026, 3, 19),
            short_description="Telugu New Year — Panchanga Sravanam, special darshan, neem-jaggery prasadam, and festive kirtan.",
            description="Ugadi (Yugadi) marks the beginning of the Hindu lunar New Year. Join us for Panchanga Sravanam, Sri Jagannath darshan, kirtan, and traditional Ugadi prasadam at Hare Krishna Land.",
            image_url=_fest_gallery(7),
            sponsorship_enabled=True,
            is_featured=True,
            sort_order=7,
        ),
        Festival(
            name="Temple special programs",
            slug="temple-special-programs",
            event_date=None,
            short_description="Sunday feasts, children’s programs, book distribution, and outreach.",
            description="Beyond major appearance days, the temple hosts weekly love feasts, go-seva days, and harinama in nearby towns. See the office bulletin for this month’s schedule.",
            image_url=_fest_gallery(7),
            sponsorship_enabled=False,
            is_featured=False,
            sort_order=8,
        ),
    ]
    added = 0
    for f in rows:
        if f.slug not in existing:
            db.add(f)
            added += 1
    if added:
        print(f"Added {added} festival(s) (skipped existing slugs).")


def seed(db: Session) -> None:
    admin_user = os.getenv("ADMIN_USERNAME", "admin")
    admin_pass = os.getenv("ADMIN_PASSWORD", "ChangeMeSecure123!")
    if not db.query(AdminUser).filter(AdminUser.username == admin_user).first():
        db.add(AdminUser(username=admin_user, hashed_password=hash_password(admin_pass)))
        print(f"Created admin user '{admin_user}' (change password in production).")

    seed_festivals(db)

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
            "Deity worship",
        ]
        gallery_slots = list(range(20, 29))
        for i, slot in enumerate(gallery_slots, start=1):
            cap = captions[(slot - 1) % len(captions)]
            db.add(
                GalleryItem(
                    media_type="image",
                    url=f"/gallery/{slot:02d}.png",
                    title=None,
                    caption=cap,
                    sort_order=i,
                )
            )
        print("Seeded gallery rows for slots 20–28 (gallery page only).")

    hero = {
        "title": "ISKCON Dornala — Sri Jagannath Temple",
        "subtitle": "Hare Krishna Land on Srisailam Road: darshan, kirtan, annadanam for yatrikas, tribal care, and joyful association.",
        "ctaPrimary": {"label": "Donate Now", "href": "/donate"},
        "ctaSecondary": {"label": "Daily Darshan", "href": "/darshan"},
        "heroImage": "/gallery/04.png",
    }
    featured = {
        "items": [
            {
                "title": "Annadanam & yatrikas",
                "description": "Free prasadam for Srisailam pilgrims and large-scale festival feasts.",
                "href": "/donate",
                "image": "/gallery/05.png",
            },
            {
                "title": "Go-seva",
                "description": "Compassionate care and feed for cows at the goshala.",
                "href": "/donate",
                "image": "/gallery/06.png",
            },
            {
                "title": "Temple construction",
                "description": "Build Sri Jagannath Temple and facilities at Hare Krishna Land.",
                "href": "/donate",
                "image": "/gallery/07.png",
            },
        ]
    }
    intro = {
        "heading": "Sri Jagannath at Hare Krishna Land",
        "body": "Under the guidance of ISKCON and Srila Prabhupada’s teachings, we serve Lord Jagannath, Baladev, and Subhadra with arati, kirtan, and prasadam — while reaching out to pilgrims, school children, and families along the sacred route to Srisailam.",
        "image": "/gallery/08.png",
        "blessing": "In this holy abode of Sri Jagannath, may every step you take draw you closer to Krishna’s lotus feet, and may your heart be filled with the nectar of the holy name.",
        "blessingAuthor": "ISKCON Dornala",
    }
    darshan_highlight = {
        "quote": "Seeing the Deities in the temple, engaged in various transcendental activities, is called darshan.",
        "attribution": "Srila Prabhupada",
    }
    name_highlight = {
        "quote": "The Lord is always ready to receive your service with love and gratitude.",
        "attribution": "Temple tradition",
    }

    defaults = [
        ("hero", json.dumps(hero)),
        ("featured_donations", json.dumps(featured)),
        ("temple_intro", json.dumps(intro)),
        ("darshan_highlight", json.dumps(darshan_highlight)),
        ("name_highlight", json.dumps(name_highlight)),
    ]
    for key, val in defaults:
        row = db.get(HomepageContent, key)
        if row:
            row.value_json = val
        else:
            db.add(HomepageContent(key=key, value_json=val))
    print("Updated homepage blocks: hero, featured_donations, temple_intro, darshan_highlight, name_highlight")

    ts_default = json.dumps({"upi_qr_url": None})
    ts_row = db.get(HomepageContent, "temple_settings")
    if not ts_row:
        db.add(HomepageContent(key="temple_settings", value_json=ts_default))
        print("Created temple_settings (UPI QR managed in admin → Temple tab).")

    db.commit()


def main() -> None:
    from app.bootstrap import wait_for_database

    wait_for_database()
    print("Database connection OK.")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
    print("Done.")


if __name__ == "__main__":
    main()
