from datetime import date, datetime
from typing import Optional

from sqlalchemy import String, Date, DateTime, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Festival(Base):
    __tablename__ = "festivals"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    event_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    short_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    registration_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sponsorship_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), server_onupdate=func.now()
    )

    donations = relationship("Donation", back_populates="festival")
