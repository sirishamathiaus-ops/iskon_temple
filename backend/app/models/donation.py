from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import String, DateTime, ForeignKey, Text, func, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DonationCategory(str, Enum):
    ANNADANAM = "annadanam"
    CARE_COW = "care_cow"
    TEMPLE_CONSTRUCTION = "temple_construction"
    FESTIVAL_SPONSORSHIP = "festival_sponsorship"
    ONE_TIME = "one_time"
    MONTHLY = "monthly"


class DonationStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"


class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="INR")
    donor_name: Mapped[str] = mapped_column(String(120), nullable=False)
    donor_email: Mapped[str] = mapped_column(String(120), nullable=False)
    donor_phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    festival_id: Mapped[Optional[int]] = mapped_column(ForeignKey("festivals.id"), nullable=True)
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(120), unique=True, index=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    proof_image_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default=DonationStatus.PENDING.value, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), server_onupdate=func.now()
    )

    festival = relationship("Festival", back_populates="donations")
