"""GET /api/about — ISKCON, founder, NVCC, deities overview, Srisailam intro."""

from fastapi import APIRouter, HTTPException

from app.schemas.content_api import AboutIndexOut, AboutSectionOut
from app.services.content_data import ABOUT_SECTIONS

router = APIRouter(prefix="/about", tags=["about"])


@router.get("", response_model=AboutIndexOut)
@router.get("/", response_model=AboutIndexOut, include_in_schema=False)
def list_about_sections():
    return AboutIndexOut(
        sections=[{"id": s["id"], "title": s["title"], "path": f"/api/about/{s['id']}"} for s in ABOUT_SECTIONS.values()]
    )


@router.get("/{section_id}", response_model=AboutSectionOut)
def get_about_section(section_id: str):
    section = ABOUT_SECTIONS.get(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="About section not found")
    return AboutSectionOut(**section)
