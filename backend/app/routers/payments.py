"""Razorpay payment APIs: orders, verification, webhooks, history, refunds."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import (
    PaymentCreateOrder,
    PaymentOrderResponse,
    PaymentOut,
    PaymentRefundRequest,
    PaymentRefundResponse,
    PaymentVerify,
    PaymentVerifyResponse,
)
from app.security import get_current_admin
from app.services.razorpay_service import get_razorpay_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])

MIN_PAISE = 100  # ₹1


@router.post("/create-order", response_model=PaymentOrderResponse)
def create_order(body: PaymentCreateOrder, db: Session = Depends(get_db)):
    """Create a Razorpay order and persist a pending payment row."""
    if body.currency != "INR":
        raise HTTPException(status_code=400, detail="Only INR is supported in this integration")

    amount_paise = int(round(body.amount_rupees * 100))
    if amount_paise < MIN_PAISE:
        raise HTTPException(status_code=400, detail="Minimum amount is ₹1")

    payment = Payment(
        amount=amount_paise,
        currency=body.currency,
        email=str(body.email).lower(),
        name=body.name,
        description=body.description,
        status=PaymentStatus.PENDING.value,
    )
    db.add(payment)
    db.flush()

    razorpay = get_razorpay_service()
    receipt = f"pay_{payment.id}"[:40]
    try:
        order = razorpay.create_order(
            amount_paise,
            body.currency,
            receipt,
            notes={"payment_id": str(payment.id), "email": payment.email},
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:  # noqa: BLE001
        db.rollback()
        logger.exception("Failed to create Razorpay order for payment %s", payment.id)
        raise HTTPException(status_code=502, detail=f"Could not create payment order: {exc!s}") from exc

    payment.razorpay_order_id = order["id"]
    db.commit()
    db.refresh(payment)

    key_id, _ = razorpay.require_configured()
    logger.info("Created payment id=%s order_id=%s amount=%s", payment.id, order["id"], amount_paise)

    return PaymentOrderResponse(
        payment_id=payment.id,
        order_id=order["id"],
        amount=amount_paise,
        currency=body.currency,
        key_id=key_id,
        email=payment.email,
        name=payment.name,
        description=payment.description,
    )


@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment(body: PaymentVerify, db: Session = Depends(get_db)):
    """Verify Razorpay signature after checkout and mark payment paid."""
    payment = db.query(Payment).filter(Payment.razorpay_order_id == body.razorpay_order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status == PaymentStatus.PAID.value:
        return PaymentVerifyResponse(
            ok=True,
            message="Payment already confirmed.",
            payment_id=payment.id,
            status=payment.status,
        )

    razorpay = get_razorpay_service()
    if not razorpay.verify_payment_signature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
    ):
        payment.status = PaymentStatus.FAILED.value
        db.commit()
        logger.warning("Invalid signature for order %s", body.razorpay_order_id)
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    payment.razorpay_payment_id = body.razorpay_payment_id
    payment.status = PaymentStatus.PAID.value
    db.commit()
    logger.info("Payment verified id=%s payment_id=%s", payment.id, body.razorpay_payment_id)

    return PaymentVerifyResponse(
        ok=True,
        message="Payment successful. Thank you!",
        payment_id=payment.id,
        status=payment.status,
    )


@router.get("/history", response_model=list[PaymentOut])
def payment_history(
    email: str,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List payments for an email (demo — use auth in production)."""
    email_norm = email.strip().lower()
    if not email_norm or "@" not in email_norm:
        raise HTTPException(status_code=400, detail="Valid email is required")

    limit = min(max(limit, 1), 100)
    rows = (
        db.query(Payment)
        .filter(Payment.email == email_norm)
        .order_by(Payment.created_at.desc())
        .limit(limit)
        .all()
    )
    return rows


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_razorpay_signature: str | None = Header(None, alias="X-Razorpay-Signature"),
):
    """
    Razorpay webhook handler (payment.captured, payment.failed, refund.created).
    Configure URL in Razorpay Dashboard → Webhooks.
    """
    body = await request.body()
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing X-Razorpay-Signature header")

    razorpay = get_razorpay_service()
    if not razorpay.verify_webhook_signature(body, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = razorpay.parse_webhook_payload(body)
    event = payload.get("event", "")
    entity = payload.get("payload", {})

    logger.info("Razorpay webhook event=%s", event)

    if event == "payment.captured":
        pay_entity = entity.get("payment", {}).get("entity", {})
        order_id = pay_entity.get("order_id")
        payment_id = pay_entity.get("id")
        if order_id and payment_id:
            row = db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()
            if row and row.status != PaymentStatus.PAID.value:
                row.razorpay_payment_id = payment_id
                row.status = PaymentStatus.PAID.value
                db.commit()
                logger.info("Webhook marked payment paid order_id=%s", order_id)

    elif event == "payment.failed":
        pay_entity = entity.get("payment", {}).get("entity", {})
        order_id = pay_entity.get("order_id")
        if order_id:
            row = db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()
            if row and row.status == PaymentStatus.PENDING.value:
                row.status = PaymentStatus.FAILED.value
                db.commit()

    elif event == "refund.processed":
        pay_entity = entity.get("payment", {}).get("entity", {})
        order_id = pay_entity.get("order_id")
        if order_id:
            row = db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()
            if row:
                row.status = PaymentStatus.REFUNDED.value
                db.commit()

    return {"ok": True}


@router.post("/{payment_id}/refund", response_model=PaymentRefundResponse)
def refund_payment(
    payment_id: int,
    body: PaymentRefundRequest,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    """
    Example refund API (admin JWT required).
    Full refund if amount_rupees is omitted.
    """
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.status != PaymentStatus.PAID.value:
        raise HTTPException(status_code=400, detail="Only paid payments can be refunded")
    if not payment.razorpay_payment_id:
        raise HTTPException(status_code=400, detail="Missing Razorpay payment id")

    amount_paise: int | None = None
    if body.amount_rupees is not None:
        amount_paise = int(round(body.amount_rupees * 100))
        if amount_paise < 1 or amount_paise > payment.amount:
            raise HTTPException(status_code=400, detail="Invalid refund amount")

    notes = {"reason": body.notes} if body.notes else None
    razorpay = get_razorpay_service()
    try:
        refund = razorpay.create_refund(payment.razorpay_payment_id, amount_paise, notes)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Refund failed: {exc!s}") from exc

    payment.status = PaymentStatus.REFUNDED.value
    db.commit()

    return PaymentRefundResponse(
        ok=True,
        message="Refund initiated successfully.",
        payment_id=payment.id,
        razorpay_refund_id=refund.get("id"),
        status=payment.status,
    )
