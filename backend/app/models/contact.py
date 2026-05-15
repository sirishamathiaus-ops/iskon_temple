from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
