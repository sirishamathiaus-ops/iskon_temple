"""GET /api/history — Srisailam temple & Radha Krishna spiritual history."""

from fastapi import APIRouter, HTTPException

from app.schemas.content_api import HistorySectionOut
from app.services.content_data import RADHA_KRISHNA_HISTORY, SRISAILAM_HISTORY

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=dict)
@router.get("/", response_model=dict, include_in_schema=False)
def list_history_topics():
    return {
        "topics": [
            {"id": "srisailam", "title": SRISAILAM_HISTORY["title"], "path": "/api/history/srisailam"},
            {"id": "radha-krishna", "title": RADHA_KRISHNA_HISTORY["title"], "path": "/api/history/radha-krishna"},
        ]
    }


@router.get("/srisailam", response_model=HistorySectionOut)
def srisailam_history():
    return HistorySectionOut(**SRISAILAM_HISTORY)


@router.get("/radha-krishna", response_model=HistorySectionOut)
def radha_krishna_history():
    return HistorySectionOut(**RADHA_KRISHNA_HISTORY)


@router.get("/{topic_id}", response_model=HistorySectionOut)
def get_history(topic_id: str):
    if topic_id == "srisailam":
        return HistorySectionOut(**SRISAILAM_HISTORY)
    if topic_id in ("radha-krishna", "radha_krishna"):
        return HistorySectionOut(**RADHA_KRISHNA_HISTORY)
    raise HTTPException(status_code=404, detail="History topic not found")
