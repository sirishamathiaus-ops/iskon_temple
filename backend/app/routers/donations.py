import hashlib
import hmac
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.donation import Donation, DonationCategory, DonationStatus
from app.models.festival import Festival
from app.schemas import DonationCreateOrder, DonationOrderResponse, DonationVerify

router = APIRouter(prefix="/donations", tags=["donations"])

ALLOWED = {c.value for c in DonationCategory}


def _require_razorpay_keys() -> tuple[str, str]:
    s = get_settings()
    if not s.razorpay_key_id or not s.razorpay_key_secret:
        raise HTTPException(
            status_code=503,
            detail="Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        )
    return s.razorpay_key_id, s.razorpay_key_secret


def _create_order_http(amount_paise: int, receipt: str, notes: dict[str, str]) -> dict[str, Any]:
    key_id, key_secret = _require_razorpay_keys()
    payload = {
        "amount": amount_paise,
        "currency": "INR",
        "receipt": receipt,
        "notes": notes,
    }
    try:
        with httpx.Client(timeout=30.0) as client:
            r = client.post(
                "https://api.razorpay.com/v1/orders",
                json=payload,
                auth=(key_id, key_secret),
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Could not reach Razorpay: {e!s}") from e

    if r.status_code >= 400:
        try:
            err_body = r.json()
            desc = err_body.get("error", {}).get("description") or err_body
        except Exception:
            desc = r.text
        raise HTTPException(status_code=502, detail=f"Razorpay error: {desc}")

    return r.json()


def _verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    _, key_secret = _require_razorpay_keys()
    msg = f"{order_id}|{payment_id}".encode()
    expected = hmac.new(key_secret.encode(), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


@router.post("/create-order", response_model=DonationOrderResponse)
def create_order(body: DonationCreateOrder, db: Session = Depends(get_db)):
    if body.category not in ALLOWED:
        raise HTTPException(status_code=400, detail="Invalid donation category")
    if body.category == DonationCategory.FESTIVAL_SPONSORSHIP.value:
        if not body.festival_id:
            raise HTTPException(status_code=400, detail="festival_id is required for festival sponsorship")
        fest = db.get(Festival, body.festival_id)
        if not fest or not fest.sponsorship_enabled:
            raise HTTPException(status_code=400, detail="Invalid or disabled festival for sponsorship")

    amount_paise = int(round(body.amount_rupees * 100))
    if amount_paise < 100:
        raise HTTPException(status_code=400, detail="Minimum amount is ₹1")

    donation = Donation(
        category=body.category,
        amount_paise=amount_paise,
        donor_name=body.donor_name,
        donor_email=str(body.donor_email),
        donor_phone=body.donor_phone,
        festival_id=body.festival_id,
        notes=body.notes,
        status=DonationStatus.PENDING.value,
    )
    db.add(donation)
    db.flush()

    receipt = f"dn_{donation.id}"[:40]
    try:
        order = _create_order_http(
            amount_paise,
            receipt,
            {"donation_id": str(donation.id), "category": body.category},
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:  # noqa: BLE001
        db.rollback()
        raise HTTPException(status_code=502, detail=f"Could not create payment order: {e!s}") from e

    donation.razorpay_order_id = order["id"]
    db.commit()
    db.refresh(donation)

    settings = get_settings()
    return DonationOrderResponse(
        donation_id=donation.id,
        order_id=order["id"],
        amount_paise=amount_paise,
        currency="INR",
        key_id=settings.razorpay_key_id,
        category=body.category,
    )


@router.post("/verify")
def verify_payment(body: DonationVerify, db: Session = Depends(get_db)):
    donation = db.query(Donation).filter(Donation.razorpay_order_id == body.razorpay_order_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.status == DonationStatus.PAID.value:
        return {"ok": True, "message": "Already confirmed.", "donation_id": donation.id}

    if not _verify_signature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature):
        donation.status = DonationStatus.FAILED.value
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    donation.razorpay_payment_id = body.razorpay_payment_id
    donation.status = DonationStatus.PAID.value
    db.commit()
    return {"ok": True, "message": "Thank you for your generous offering.", "donation_id": donation.id}
