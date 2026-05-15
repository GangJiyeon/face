"""add users and analysis history tables

Revision ID: 002
Revises: 001
Create Date: 2026-05-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text("""
        CREATE TABLE IF NOT EXISTS users (
            id              VARCHAR PRIMARY KEY,
            google_id       VARCHAR NOT NULL UNIQUE,
            email           VARCHAR NOT NULL UNIQUE,
            name            VARCHAR,
            profile_image   VARCHAR,
            created_at      TIMESTAMP DEFAULT NOW()
        )
    """))

    op.execute(sa.text("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id          VARCHAR PRIMARY KEY,
            user_id     VARCHAR NOT NULL REFERENCES users(id),
            skin_scores JSON,
            skin_type   VARCHAR,
            analyzed_at TIMESTAMP DEFAULT NOW()
        )
    """))


def downgrade() -> None:
    op.execute(sa.text("DROP TABLE IF EXISTS analysis_history"))
    op.execute(sa.text("DROP TABLE IF EXISTS users"))
