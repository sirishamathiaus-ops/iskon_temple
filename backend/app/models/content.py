from datetime import datetime

from sqlalchemy import String, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class HomepageContent(Base):
    __tablename__ = "homepage_content"

    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value_json: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
