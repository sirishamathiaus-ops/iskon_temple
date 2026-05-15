from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import String, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class GalleryMediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    media_type: Mapped[str] = mapped_column(String(20), default=GalleryMediaType.IMAGE.value)
    url: Mapped[str] = mapped_column(String(800), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(800), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    caption: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
