import time

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.database import engine


def wait_for_database(max_attempts: int = 40) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except OperationalError:
            if attempt == max_attempts:
                raise
            time.sleep(1)
