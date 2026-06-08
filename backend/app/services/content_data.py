"""
Static content served by /api/about, /api/history, /api/deities, and festival enrichment.
Gallery image paths match frontend public assets.
"""

from datetime import date
from typing import Any

# --- Festival enrichment (merged with DB records) ---

FESTIVAL_ENRICHMENT: dict[str, dict[str, Any]] = {
    "balarama-jayanti-2026": {
        "importance": (
            "Balarama is the source of spiritual strength — worshipping Him prepares the heart "
            "to receive Krishna's mercy through the parampara."
        ),
        "timings": [
            {"label": "Mangala arati", "time": "4:30 AM"},
            {"label": "Abhishekam", "time": "10:00 AM"},
            {"label": "Special arati & kirtan", "time": "12:00 PM"},
            {"label": "Maha prasadam", "time": "1:00 PM"},
            {"label": "Sandhya arati", "time": "6:30 PM"},
        ],
        "gallery_images": ["/spiritual/balaramjayanthi.jpg", "/spiritual/Radhakrishna1.jpg"],
        "fallback": {
            "id": 0,
            "name": "Balarama Jayanti",
            "slug": "balarama-jayanti-2026",
            "event_date": date(2026, 8, 28),
            "short_description": (
                "Appearance of Lord Balarama — abhishekam, special darshan, kirtan, and maha prasadam."
            ),
            "description": (
                "Celebrate the divine appearance of Lord Balarama, the elder brother of Sri Krishna "
                "and the original spiritual master. Join us for darshan, abhishekam, kirtan, and prasadam."
            ),
            "image_url": "/spiritual/balaramjayanthi.jpg",
            "sponsorship_enabled": True,
            "is_featured": True,
            "sort_order": 2,
        },
    },
    "ugadi-2026": {
        "importance": (
            "Ugadi teaches renewal of spiritual vows, gratitude for the parampara, "
            "and harmony with nature's cycles — aligned with Vaishnava values of humble service and chanting the holy names."
        ),
        "timings": [
            {"label": "Mangala arati & darshan", "time": "4:30 AM"},
            {"label": "Panchanga Sravanam", "time": "8:00 AM"},
            {"label": "Special arati & kirtan", "time": "12:00 PM"},
            {"label": "Ugadi prasadam feast", "time": "1:00 PM"},
            {"label": "Evening darshan & sandhya arati", "time": "6:30 PM"},
        ],
        "gallery_images": ["/gallery/17.png", "/gallery/18.png", "/gallery/19.png"],
        "fallback": {
            "id": 0,
            "name": "Ugadi",
            "slug": "ugadi-2026",
            "event_date": date(2026, 3, 19),
            "short_description": (
                "Telugu New Year — Panchanga Sravanam, special darshan, neem-jaggery prasadam, and festive kirtan."
            ),
            "description": (
                "Ugadi (Yugadi) marks the beginning of the Hindu lunar New Year in Andhra Pradesh and Telangana. "
                "At ISKCON Dornala we observe Panchanga Sravanam, Sri Jagannath darshan, kirtan, and traditional "
                "Ugadi prasadam for pilgrims on the Srisailam route."
            ),
            "image_url": "/gallery/17.png",
            "sponsorship_enabled": True,
            "is_featured": True,
            "sort_order": 7,
        },
    },
}

# --- About sections ---

ABOUT_SECTIONS: dict[str, dict[str, Any]] = {
    "iskcon": {
        "id": "iskcon",
        "title": "About ISKCON",
        "subtitle": "International Society for Krishna Consciousness — spreading the science of bhakti-yoga",
        "sections": [
            {
                "heading": "Our mission",
                "body": "ISKCON was founded to spread Krishna consciousness worldwide through the teachings of Bhagavad-gita and Srimad-Bhagavatam, as presented by Srila Prabhupada.",
            },
            {
                "heading": "What we do",
                "body": "Daily worship of Sri Sri Jagannath, Baladev, and Subhadra; prasadam distribution; and care for pilgrims on the Srisailam route.",
            },
        ],
        "bullets": [
            "Sankirtan — congregational chanting of the holy names",
            "Deity worship in the mood of serving the Lord",
            "Prasadam distribution",
        ],
        "image_paths": ["/gallery/08.png", "/gallery/01.png"],
    },
    "founder": {
        "id": "founder",
        "title": "ISKCON Founder — Srila Prabhupada",
        "subtitle": "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896–1977)",
        "sections": [
            {
                "heading": "A lifetime of dedication",
                "body": "Srila Prabhupada travelled to the West in 1965 and established ISKCON, inspiring thousands to take up Krishna consciousness.",
            },
            {
                "heading": "Legacy at Dornala",
                "body": "ISKCON Dornala continues his vision on Hare Krishna Land with kirtan, annadanam, and book distribution.",
            },
        ],
        "sloka": {
            "text": "kṛṣṇa-surya-sama-māyā haya andhakāra",
            "meaning": "May the sun of Krishna consciousness dispel the darkness of ignorance.",
        },
        "image_paths": ["/gallery/01.png", "/gallery/02.png"],
    },
    "nvcc": {
        "id": "nvcc",
        "title": "ISKCON NVCC",
        "subtitle": "North Vijayawada Cultural Centre — regional outreach and education",
        "sections": [
            {
                "heading": "Regional coordination",
                "body": "ISKCON NVCC coordinates temple activities, festivals, and educational initiatives across Andhra Pradesh.",
            },
        ],
        "bullets": ["Festival coordination", "Congregation training", "Annadanam support"],
        "image_paths": ["/gallery/04.png"],
    },
    "deities-timetable": {
        "id": "deities-timetable",
        "title": "Deities — worship timetable",
        "subtitle": "Daily darshan for Sri Jagannath, Baladev & Subhadra",
        "sections": [
            {
                "heading": "Daily worship",
                "body": "The Deities are dressed, offered bhoga, and worshipped throughout the day. See /api/deities for full timings.",
            },
        ],
        "image_paths": ["/gallery/08.png"],
    },
    "srisailam": {
        "id": "srisailam",
        "title": "Srisailam Temple History",
        "subtitle": "Mallikarjuna Jyotirlinga on the Krishna River",
        "sections": [
            {
                "heading": "Jyotirlinga significance",
                "body": "Srisailam is celebrated as a Jyotirlinga kshetra where Lord Shiva manifests as Mallikarjuna Swamy.",
            },
        ],
        "image_paths": ["/gallery/03.png", "/gallery/04.png"],
    },
}

# --- History ---

SRISAILAM_HISTORY: dict[str, Any] = {
    "id": "srisailam",
    "title": "Srisailam Mallikarjuna Swamy Temple",
    "subtitle": "One of the twelve sacred Jyotirlingas",
    "intro": (
        "Srisailam is among the most revered pilgrimage centres in India, where Lord Shiva manifests as Mallikarjuna Swamy. "
        "Nestled in the Nallamala hills, the temple draws millions of devotees seeking darshan and liberation."
    ),
    "sections": [
        {
            "heading": "Jyotirlinga significance",
            "body": "A Jyotirlinga is a radiant sign of Shiva's infinite form at Sri Parvata — Mallikarjuna Kshetra.",
        },
        {
            "heading": "Shiva & Parvati",
            "body": "Goddess Parvati came as Mallika and Lord Shiva as Arjuna — hence Mallikarjuna.",
        },
        {
            "heading": "In Hindu culture",
            "body": "Srisailam appears in the Puranas and remains central to South Indian pilgrimage circuits.",
        },
    ],
    "architecture": "Dravidian gopurams, mandapams, and the Mukha Linga reflect layered royal patronage over centuries.",
    "festivals": ["Maha Shivaratri", "Ugadi & Kartika masam", "Annual Brahmotsavams"],
    "tourism": "Sakshi Ganapati, Pathala Ganga, Sikharam hilltop view, and the Nallamala sanctuary.",
    "spiritual_note": "Many Srisailam yatrikas receive prasadam and harinam at Hare Krishna Land on Dornala Road.",
    "sloka": {"text": "ॐ नमः शिवाय", "meaning": "Om Namah Shivaya — salutations to Lord Shiva."},
    "timeline": [
        {"era": "Ancient", "detail": "Revered in Puranas as Sri Parvata and Jyotirlinga kshetra."},
        {"era": "Medieval", "detail": "Chalukya and Vijayanagara patronage expanded the complex."},
        {"era": "Today", "detail": "Millions visit yearly; yatrikas are served at ISKCON Dornala."},
    ],
    "image_paths": ["/gallery/03.png", "/gallery/04.png", "/gallery/09.png"],
}

RADHA_KRISHNA_HISTORY: dict[str, Any] = {
    "id": "radha-krishna",
    "title": "Radha Krishna — divine love & devotion",
    "subtitle": "The eternal pastimes of Vrindavan and the path of bhakti-yoga",
    "intro": (
        "Radha and Krishna are one — Radha is Krishna's hladini shakti. Their līlā in Vrindavan is the model for selfless bhakti."
    ),
    "sections": [
        {
            "heading": "Story of Radha Krishna",
            "body": "In Vrindavan, Krishna enlivens every forest with flute song. Srimati Radharani leads the gopis in pure devotional service.",
        },
        {
            "heading": "Bhakti tradition",
            "body": "Sri Chaitanya Mahaprabhu spread sankirtan; ISKCON continues this mission at Dornala.",
        },
        {
            "heading": "Krishna's teachings",
            "body": "In Bhagavad-gita, Krishna instructs Arjuna to surrender unto Him — the culmination of all religion.",
        },
    ],
    "sloka": {
        "text": "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
        "meaning": "The Maha-mantra — calling the holy names awakens love of God.",
    },
    "image_paths": ["/gallery/01.png", "/gallery/02.png"],
}

# --- Deities timetable (default when DB empty) ---

DEFAULT_DEITY_TIMINGS: list[dict[str, str]] = [
    {"section": "daily_pooja", "title": "Suprabhatam & Darshan", "time_label": "4:30 AM – 8:30 AM", "day_note": "Daily"},
    {"section": "daily_pooja", "title": "Sringar Darshan", "time_label": "8:30 AM – 12:00 PM", "day_note": "Daily"},
    {"section": "daily_pooja", "title": "Raj Bhoga & Darshan", "time_label": "12:30 PM – 1:00 PM", "day_note": "Daily"},
    {"section": "daily_pooja", "title": "Utthapana & Darshan", "time_label": "4:15 PM – 8:30 PM", "day_note": "Daily"},
    {"section": "aarti", "title": "Mangala Arati", "time_label": "4:30 AM", "day_note": "Daily"},
    {"section": "aarti", "title": "Dhoop Arati", "time_label": "8:00 AM", "day_note": "Daily"},
    {"section": "aarti", "title": "Sandhya Arati", "time_label": "6:30 PM", "day_note": "Daily"},
]
