from sqlalchemy.ext.asyncio import AsyncSession
from .models import User
from .schemas import RegisterPayload, UserWithToken, LoginPayload
from src.auth import utils as auth_utils
import logging
from src.auth import repository as auth_repo
from .exceptions import DuplicateUserException, InvalidCredentialsException
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


async def register_user(user_data: RegisterPayload, db: AsyncSession) -> UserWithToken:
    """
    Create a new user row using provided credentials
    """
    # Hash the password
    hashed_password = auth_utils.get_password_hash(user_data.password)
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
    )

    try:
        await auth_repo.create_user(new_user, db)
    except IntegrityError:
        raise DuplicateUserException

    # Generate token
    # access_token_expires = timedelta(hours=TOKEN_EXPIRE_TIME)
    token = auth_utils.create_access_token_for_user(new_user)

    return UserWithToken(
        id=new_user.id, username=new_user.username, email=new_user.email, token=token
    )


async def login_user(login_payload: LoginPayload, db: AsyncSession) -> UserWithToken:
    """
    Returns User info with token provided login credentials
    """
    logger.info("Login attempt for email=%s", login_payload.email)

    existing_user = await auth_repo.get_by_email(login_payload.email, db)
    if not existing_user:
        raise InvalidCredentialsException
    # Match the provided password with hashed password
    is_match = auth_utils.verify_password(
        login_payload.password, existing_user.password
    )
    if not is_match:
        raise InvalidCredentialsException
    # Generate token
    # access_token_expires = timedelta(hours=TOKEN_EXPIRE_TIME)
    token = auth_utils.create_access_token_for_user(existing_user)
    return UserWithToken(
        id=existing_user.id,
        username=existing_user.username,
        email=existing_user.email,
        token=token,
    )
