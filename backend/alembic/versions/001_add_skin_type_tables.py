"""add skin type tables

Revision ID: 001
Revises:
Create Date: 2026-05-13

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL has no CREATE TYPE IF NOT EXISTS; use PL/pgSQL exception block
    op.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE level AS ENUM ('low', 'mid', 'high');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """))

    op.execute(sa.text("""
        CREATE TABLE IF NOT EXISTS skin_types (
            id          VARCHAR PRIMARY KEY,
            name        VARCHAR NOT NULL UNIQUE,
            moisture_level  level NOT NULL,
            oil_level       level NOT NULL,
            sensitivity     level NOT NULL,
            description TEXT
        )
    """))

    op.execute(sa.text("""
        CREATE TABLE IF NOT EXISTS skin_profiles (
            id              VARCHAR PRIMARY KEY,
            skin_type_id    VARCHAR NOT NULL REFERENCES skin_types(id),
            priority        INTEGER NOT NULL DEFAULT 0,
            moisture_min    FLOAT,
            moisture_max    FLOAT,
            redness_min     FLOAT,
            redness_max     FLOAT,
            trouble_min     FLOAT,
            trouble_max     FLOAT,
            brightness_min  FLOAT,
            brightness_max  FLOAT,
            tone_min        FLOAT,
            tone_max        FLOAT
        )
    """))

    op.execute(sa.text(
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS suitable_skin_types JSON"
    ))


def downgrade() -> None:
    op.execute(sa.text("ALTER TABLE products DROP COLUMN IF EXISTS suitable_skin_types"))
    op.execute(sa.text("DROP TABLE IF EXISTS skin_profiles"))
    op.execute(sa.text("DROP TABLE IF EXISTS skin_types"))
    op.execute(sa.text("DROP TYPE IF EXISTS level"))
