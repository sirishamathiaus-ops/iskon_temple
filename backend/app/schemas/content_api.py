"""Schemas for /api/about, /api/history, /api/deities, enriched festivals."""

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class FestivalTimingOut(BaseModel):
    label: str
    time: str


class FestivalDetailOut(BaseModel):
    id: int
    name: str
    slug: str
    event_date: Optional[date] = None
    end_date: Optional[date] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    registration_url: Optional[str] = None
    sponsorship_enabled: bool = True
    is_featured: bool = False
    sort_order: int = 0
    created_at: Optional[datetime] = None
    importance: Optional[str] = None
    timings: list[FestivalTimingOut] = Field(default_factory=list)
    gallery_images: list[str] = Field(default_factory=list)

    class Config:
        from_attributes = True


class AboutSectionOut(BaseModel):
    id: str
    title: str
    subtitle: str
    sections: list[dict[str, str]]
    bullets: list[str] = Field(default_factory=list)
    sloka: Optional[dict[str, str]] = None
    image_paths: list[str] = Field(default_factory=list)


class AboutIndexOut(BaseModel):
    sections: list[dict[str, str]]


class HistorySectionOut(BaseModel):
    id: str
    title: str
    subtitle: str
    intro: str
    sections: list[dict[str, str]]
    architecture: Optional[str] = None
    festivals: list[str] = Field(default_factory=list)
    tourism: Optional[str] = None
    spiritual_note: Optional[str] = None
    sloka: Optional[dict[str, str]] = None
    timeline: list[dict[str, str]] = Field(default_factory=list)
    image_paths: list[str] = Field(default_factory=list)


class DeityTimingOut(BaseModel):
    section: str
    title: str
    time_label: str
    day_note: Optional[str] = None


class DeitiesTimetableOut(BaseModel):
    title: str
    subtitle: str
    deities: list[str]
    timings: list[DeityTimingOut]
    note: str
