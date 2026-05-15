"""Wait until PostgreSQL accepts connections."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.bootstrap import wait_for_database


def main() -> None:
    wait_for_database()
    print("Database connection OK.")


if __name__ == "__main__":
    main()
