"""Initial migration

Revision ID: b2a53e3ee1a0
Revises: 
Create Date: 2026-04-29 03:03:28.984429

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2a53e3ee1a0'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create t_usuario table
    op.create_table('t_usuario',
        sa.Column('idt_usuario', sa.Integer(), nullable=False),
        sa.Column('des_email', sa.String(length=255), nullable=False),
        sa.Column('des_senha', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('idt_usuario')
    )
    op.create_index(op.f('ix_t_usuario_des_email'), 't_usuario', ['des_email'], unique=True)
    op.create_index(op.f('ix_t_usuario_idt_usuario'), 't_usuario', ['idt_usuario'], unique=False)

    # Create t_status table
    op.create_table('t_status',
        sa.Column('idt_status', sa.Integer(), nullable=False),
        sa.Column('ind_status', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('idt_status')
    )
    op.create_index(op.f('ix_t_status_idt_status'), 't_status', ['idt_status'], unique=False)

    # Create t_tarefa table
    op.create_table('t_tarefa',
        sa.Column('idt_tarefa', sa.Integer(), nullable=False),
        sa.Column('nom_tarefa', sa.String(length=255), nullable=False),
        sa.Column('des_tarefa', sa.String(length=255), nullable=False),
        sa.Column('ind_ativo', sa.Boolean(), nullable=False),
        sa.Column('idt_usuario', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('idt_tarefa')
    )
    op.create_index(op.f('ix_t_tarefa_idt_tarefa'), 't_tarefa', ['idt_tarefa'], unique=False)

    # Create t_historico table
    op.create_table('t_historico',
        sa.Column('idt_historico', sa.Integer(), nullable=False),
        sa.Column('idt_status', sa.Integer(), nullable=False),
        sa.Column('idt_tarefa', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('idt_historico')
    )
    op.create_index(op.f('ix_t_historico_idt_historico'), 't_historico', ['idt_historico'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop t_historico table
    op.drop_index(op.f('ix_t_historico_idt_historico'), table_name='t_historico')
    op.drop_table('t_historico')

    # Drop t_tarefa table
    op.drop_index(op.f('ix_t_tarefa_idt_tarefa'), table_name='t_tarefa')
    op.drop_table('t_tarefa')

    # Drop t_status table
    op.drop_index(op.f('ix_t_status_idt_status'), table_name='t_status')
    op.drop_table('t_status')

    # Drop t_usuario table
    op.drop_index(op.f('ix_t_usuario_idt_usuario'), table_name='t_usuario')
    op.drop_index(op.f('ix_t_usuario_des_email'), table_name='t_usuario')
    op.drop_table('t_usuario')
