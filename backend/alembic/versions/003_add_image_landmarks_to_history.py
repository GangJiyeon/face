"""add image and landmarks columns to analysis_history

Revision ID: 003
Revises: 002
Create Date: 2026-05-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text("""
        ALTER TABLE analysis_history
            ADD COLUMN IF NOT EXISTS image_filename VARCHAR,
            ADD COLUMN IF NOT EXISTS landmarks      JSON,
            ADD COLUMN IF NOT EXISTS image_size     JSON
    """))


def downgrade() -> None:
    op.execute(sa.text("""
        ALTER TABLE analysis_history
            DROP COLUMN IF EXISTS image_filename,
            DROP COLUMN IF EXISTS landmarks,
            DROP COLUMN IF EXISTS image_size
    """))
