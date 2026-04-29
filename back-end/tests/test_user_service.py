import pytest
from fastapi import HTTPException


class TestUserService:
    """Test user service functions."""

    def test_service_import(self):
        """Test that user service can be imported."""
        try:
            from main.services.user_service import create_user
            assert create_user is not None
        except ImportError:
            pytest.fail("Could not import user service")

    def test_models_import(self):
        """Test that models can be imported."""
        try:
            from main.models.models import UserModel, TaskModel, StatusModel, HistoryModel
            assert UserModel is not None
            assert TaskModel is not None
            assert StatusModel is not None
            assert HistoryModel is not None
        except ImportError:
            pytest.fail("Could not import models")

    def test_validators_import(self):
        """Test that validators can be imported."""
        try:
            from main.validators.user_register_validator import UserRegisterValidator
            assert UserRegisterValidator is not None
        except ImportError:
            pytest.fail("Could not import validators")