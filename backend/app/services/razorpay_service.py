"""Razorpay REST client and signature verification (secret key stays server-side only)."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
from typing import Any

import httpx
from fastapi import HTTPException

from app.config import get_settings

logger = logging.getLogger(__name__)

RAZORPAY_API = "https://api.razorpay.com/v1"


class RazorpayService:
    def __init__(self) -> None:
        settings = get_settings()
        self.key_id = settings.razorpay_key_id
        self.key_secret = settings.razorpay_key_secret
        self.webhook_secret = settings.razorpay_webhook_secret

    def require_configured(self) -> tuple[str, str]:
        if not self.key_id or not self.key_secret:
            raise HTTPException(
                status_code=503,
                detail="Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env",
            )
        return self.key_id, self.key_secret

    def _auth(self) -> tuple[str, str]:
        return self.require_configured()

    def _request(
        self,
        method: str,
        path: str,
        *,
        json_body: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        key_id, key_secret = self._auth()
        url = f"{RAZORPAY_API}{path}"
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.request(
                    method,
                    url,
                    json=json_body,
                    auth=(key_id, key_secret),
                )
        except httpx.HTTPError as exc:
            logger.exception("Razorpay HTTP error: %s %s", method, path)
            raise HTTPException(status_code=502, detail=f"Could not reach Razorpay: {exc!s}") from exc

        if response.status_code >= 400:
            try:
                err_body = response.json()
                desc = err_body.get("error", {}).get("description") or err_body
            except Exception:
                desc = response.text
            logger.warning("Razorpay API error %s: %s", response.status_code, desc)
            raise HTTPException(status_code=502, detail=f"Razorpay error: {desc}")

        return response.json()

    def create_order(
        self,
        amount_paise: int,
        currency: str,
        receipt: str,
        notes: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt[:40],
        }
        if notes:
            payload["notes"] = notes
        return self._request("POST", "/orders", json_body=payload)

    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        _, key_secret = self._auth()
        message = f"{order_id}|{payment_id}".encode()
        expected = hmac.new(key_secret.encode(), message, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    def verify_webhook_signature(self, body: bytes, signature: str) -> bool:
        if not self.webhook_secret:
            logger.warning("RAZORPAY_WEBHOOK_SECRET not set — webhook rejected")
            return False
        expected = hmac.new(self.webhook_secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    def create_refund(
        self,
        payment_id: str,
        amount_paise: int | None = None,
        notes: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        if amount_paise is not None:
            payload["amount"] = amount_paise
        if notes:
            payload["notes"] = notes
        return self._request("POST", f"/payments/{payment_id}/refund", json_body=payload or None)

    @staticmethod
    def parse_webhook_payload(body: bytes) -> dict[str, Any]:
        try:
            return json.loads(body.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            raise HTTPException(status_code=400, detail="Invalid webhook JSON") from exc


def get_razorpay_service() -> RazorpayService:
    return RazorpayService()
