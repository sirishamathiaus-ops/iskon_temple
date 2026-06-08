"""
Entry point for: uvicorn main:app --reload
Run from the backend/ directory.
"""

from app.main import app

__all__ = ["app"]
