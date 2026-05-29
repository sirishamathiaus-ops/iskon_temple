from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class PaymentCreateOrder(BaseModel):
    amount_rupees: float = Field(..., gt=0, description="Amount in INR rupees")
    email: EmailStr
    name: Optional[str] = Field(None, max_length=120)
    description: Optional[str] = Field(None, max_length=500)
    currency: str = Field(default="INR", pattern=r"^[A-Z]{3}$")


class PaymentOrderResponse(BaseModel):
    payment_id: int
    order_id: str
    amount: int  # paise
    currency: str
    key_id: str
    email: str
    name: Optional[str] = None
    description: Optional[str] = None


class PaymentVerify(BaseModel):
    razorpay_order_id: str = Field(..., min_length=1, max_length=120)
    razorpay_payment_id: str = Field(..., min_length=1, max_length=120)
    razorpay_signature: str = Field(..., min_length=1, max_length=256)


class PaymentVerifyResponse(BaseModel):
    ok: bool
    message: str
    payment_id: int
    status: str


class PaymentOut(BaseModel):
    id: int
    razorpay_order_id: Optional[str]
    razorpay_payment_id: Optional[str]
    amount: int
    currency: str
    status: str
    email: str
    name: Optional[str]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentRefundRequest(BaseModel):
    """Partial or full refund in rupees; omit amount for full refund."""
    amount_rupees: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = Field(None, max_length=255)


class PaymentRefundResponse(BaseModel):
    ok: bool
    message: str
    payment_id: int
    razorpay_refund_id: Optional[str] = None
    status: str
