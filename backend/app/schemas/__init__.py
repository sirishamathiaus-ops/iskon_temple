from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None


class AdminLogin(BaseModel):
    username: str
    password: str


class FestivalBase(BaseModel):
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


class FestivalCreate(FestivalBase):
    pass


class FestivalUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    event_date: Optional[date] = None
    end_date: Optional[date] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    registration_url: Optional[str] = None
    sponsorship_enabled: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class FestivalOut(FestivalBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GalleryItemBase(BaseModel):
    media_type: str = "image"
    url: str
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    sort_order: int = 0


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItemOut(GalleryItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DarshanTimingBase(BaseModel):
    section: str
    title: str
    time_label: str
    day_note: Optional[str] = None
    sort_order: int = 0


class DarshanTimingCreate(DarshanTimingBase):
    pass


class DarshanTimingUpdate(BaseModel):
    section: Optional[str] = None
    title: Optional[str] = None
    time_label: Optional[str] = None
    day_note: Optional[str] = None
    sort_order: Optional[int] = None


class DarshanTimingOut(DarshanTimingBase):
    id: int

    class Config:
        from_attributes = True


class HomepageContentUpdate(BaseModel):
    key: str = Field(..., max_length=80)
    value_json: str


class HomepageContentOut(BaseModel):
    key: str
    value_json: str
    updated_at: datetime

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str = Field(..., max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class DonationCreateOrder(BaseModel):
    category: str
    amount_rupees: float = Field(..., gt=0)
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    festival_id: Optional[int] = None
    notes: Optional[str] = None


class DonationOrderResponse(BaseModel):
    donation_id: int
    order_id: str
    amount_paise: int
    currency: str
    key_id: str
    category: str


class DonationVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class DonationOut(BaseModel):
    id: int
    category: str
    amount_paise: int
    currency: str
    donor_name: str
    donor_email: str
    donor_phone: Optional[str]
    festival_id: Optional[int]
    razorpay_order_id: Optional[str]
    razorpay_payment_id: Optional[str]
    status: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DonationUpdateAdmin(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
