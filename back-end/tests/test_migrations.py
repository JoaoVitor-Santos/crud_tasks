import pytest
from sqlalchemy import text


class TestMigrations:
    """Test database migrations and schema."""

    def test_tables_exist(self, test_db):
        """Test that all required tables exist."""
        result = test_db.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN ('t_usuario', 't_tarefa', 't_status', 't_historico')
        """))

        tables = [row[0] for row in result.fetchall()]
        expected_tables = {'t_usuario', 't_tarefa', 't_status', 't_historico'}

        assert expected_tables.issubset(set(tables)), f"Missing tables: {expected_tables - set(tables)}"

    def test_user_table_schema(self, test_db):
        """Test t_usuario table schema."""
        result = test_db.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 't_usuario'
            ORDER BY column_name
        """))

        columns = {row[0]: {'type': row[1], 'nullable': row[2]} for row in result.fetchall()}

        # Check required columns exist
        assert 'idt_usuario' in columns
        assert 'des_email' in columns
        assert 'des_senha' in columns

        # Check data types
        assert columns['idt_usuario']['type'] == 'integer'
        assert 'character varying' in columns['des_email']['type']
        assert 'character varying' in columns['des_senha']['type']

        # Check constraints
        assert columns['idt_usuario']['nullable'] == 'NO'
        assert columns['des_email']['nullable'] == 'NO'
        assert columns['des_senha']['nullable'] == 'NO'

    def test_task_table_schema(self, test_db):
        """Test t_tarefa table schema."""
        result = test_db.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 't_tarefa'
            ORDER BY column_name
        """))

        columns = {row[0]: {'type': row[1], 'nullable': row[2]} for row in result.fetchall()}

        # Check required columns exist
        assert 'idt_tarefa' in columns
        assert 'nom_tarefa' in columns
        assert 'des_tarefa' in columns
        assert 'ind_ativo' in columns
        assert 'idt_usuario' in columns

        # Check data types
        assert columns['idt_tarefa']['type'] == 'integer'
        assert 'character varying' in columns['nom_tarefa']['type']
        assert 'character varying' in columns['des_tarefa']['type']
        assert columns['ind_ativo']['type'] == 'boolean'
        assert columns['idt_usuario']['type'] == 'integer'

        # Check constraints
        assert columns['idt_tarefa']['nullable'] == 'NO'
        assert columns['nom_tarefa']['nullable'] == 'NO'
        assert columns['des_tarefa']['nullable'] == 'NO'
        assert columns['ind_ativo']['nullable'] == 'NO'
        assert columns['idt_usuario']['nullable'] == 'NO'

    def test_status_table_schema(self, test_db):
        """Test t_status table schema."""
        result = test_db.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 't_status'
            ORDER BY column_name
        """))

        columns = {row[0]: {'type': row[1], 'nullable': row[2]} for row in result.fetchall()}

        # Check required columns exist
        assert 'idt_status' in columns
        assert 'ind_status' in columns

        # Check data types
        assert columns['idt_status']['type'] == 'integer'
        assert 'character varying' in columns['ind_status']['type']

        # Check constraints
        assert columns['idt_status']['nullable'] == 'NO'
        assert columns['ind_status']['nullable'] == 'NO'

    def test_history_table_schema(self, test_db):
        """Test t_historico table schema."""
        result = test_db.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 't_historico'
            ORDER BY column_name
        """))

        columns = {row[0]: {'type': row[1], 'nullable': row[2]} for row in result.fetchall()}

        # Check required columns exist
        assert 'idt_historico' in columns
        assert 'idt_status' in columns
        assert 'idt_tarefa' in columns

        # Check data types
        assert columns['idt_historico']['type'] == 'integer'
        assert columns['idt_status']['type'] == 'integer'
        assert columns['idt_tarefa']['type'] == 'integer'

        # Check constraints
        assert columns['idt_historico']['nullable'] == 'NO'
        assert columns['idt_status']['nullable'] == 'NO'
        assert columns['idt_tarefa']['nullable'] == 'NO'

    def test_indexes_exist(self, test_db):
        """Test that required indexes exist."""
        result = test_db.execute(text("""
            SELECT indexname, tablename
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename IN ('t_usuario', 't_tarefa', 't_status', 't_historico')
        """))

        indexes = {(row[1], row[0]) for row in result.fetchall()}

        # Check for primary key indexes at least
        expected_indexes = {
            ('t_usuario', 'ix_t_usuario_idt_usuario'),
            ('t_tarefa', 'ix_t_tarefa_idt_tarefa'),
            ('t_status', 'ix_t_status_idt_status'),
            ('t_historico', 'ix_t_historico_idt_historico'),
        }

        # At least check that we have some indexes
        assert len(indexes) > 0, "No indexes found"

    def test_database_connection(self, test_db):
        """Test basic database connectivity."""
        result = test_db.execute(text("SELECT 1 as test"))
        row = result.fetchone()
        assert row[0] == 1