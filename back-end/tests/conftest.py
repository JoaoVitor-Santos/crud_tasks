import pytest
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from main.connection import Base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use the main database for testing (be careful!)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/db_gestao_tarefa")

@pytest.fixture(scope="session")
def test_engine():
    """Create a test database engine."""
    engine = create_engine(DATABASE_URL)
    yield engine
    # Don't dispose here as we want to keep the connection for manual cleanup

@pytest.fixture(scope="function")
def test_db(test_engine):
    """Create a test database session."""
    # Create all tables for testing
    Base.metadata.create_all(bind=test_engine)

    # Create session
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestSessionLocal()

    try:
        yield db
    finally:
        db.rollback()
        db.close()
        # Note: We don't drop tables here to avoid affecting the main database
        # In a real scenario, you'd use a separate test database