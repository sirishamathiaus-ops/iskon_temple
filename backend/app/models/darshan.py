from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DarshanTiming(Base):
    __tablename__ = "darshan_timings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    section: Mapped[str] = mapped_column(
        String(40), nullable=False, index=True
    )  # daily_pooja, aarti, special
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    time_label: Mapped[str] = mapped_column(String(120), nullable=False)
    day_note: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), server_onupdate=func.now()
    )
