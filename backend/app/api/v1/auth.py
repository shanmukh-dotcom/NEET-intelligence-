"""
Authentication endpoints: login, register, get current user.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.models.user import User, Role, UserRole
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})

    roles = [ur.role.name for ur in user.user_roles] if user.user_roles else []

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            organization=user.organization,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            roles=roles,
            last_login=user.last_login,
            created_at=user.created_at,
        ),
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    # Check for existing email / username
    existing = db.query(User).filter(
        (User.email == user_in.email) | (User.username == user_in.username)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email or username already exists",
        )

    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        organization=user_in.organization,
    )
    db.add(user)
    db.flush()

    # Assign default "analyst" role
    analyst_role = db.query(Role).filter(Role.name == "analyst").first()
    if analyst_role:
        db.add(UserRole(user_id=user.id, role_id=analyst_role.id))

    db.commit()
    db.refresh(user)

    roles = [ur.role.name for ur in user.user_roles] if user.user_roles else []

    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        organization=user.organization,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        roles=roles,
        created_at=user.created_at,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    roles = [ur.role.name for ur in current_user.user_roles] if current_user.user_roles else []
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        organization=current_user.organization,
        is_active=current_user.is_active,
        is_superuser=current_user.is_superuser,
        roles=roles,
        last_login=current_user.last_login,
        created_at=current_user.created_at,
    )
