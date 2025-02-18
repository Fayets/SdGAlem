from typing import Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Query, Depends, HTTPException
from pony.orm import db_session, desc, select
from pydantic import BaseModel
from src import models
from src.models import Roles
from src.services.user_services import UsersService
from src.controllers.auth_controller import get_current_user

router = APIRouter()
user_service = UsersService()