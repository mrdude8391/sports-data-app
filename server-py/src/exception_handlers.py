import logging
from asyncpg import UniqueViolationError
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from src.auth.exceptions import InvalidCredentialsException, DuplicateUserException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from pydantic_core import ValidationError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(ValidationError)
    async def pydantic_validation_handler(_, exc: ValidationError):
        logger.exception("Validation Error")
        return JSONResponse(
            status_code=422,
            content={
                "error": "VALIDATION_ERROR",
                "detail": "Invalid Input",
            },
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(_, exc: InvalidCredentialsException):
        logger.error("Invalid Credentials Error")
        return JSONResponse(
            status_code=401,
            content={
                "error": "INVALID_CREDENTIALS",
                "detail": "Invalid email or password",
            },
        )

    @app.exception_handler(DuplicateUserException)
    async def duplicate_user_handler(_, exc: DuplicateUserException):
        logger.error("Duplicate Error")
        return JSONResponse(
            status_code=409,
            content={"error": "DUPLICATE_USER", "detail": "Email already being used"},
        )

    @app.exception_handler(IntegrityError)
    async def duplicate_key_handler(_, exc: IntegrityError):
        logger.exception(f"Integrity Error\n\n{exc}")

        return JSONResponse(
            status_code=409,
            content={
                "error": "DB_INTEGRITY_ERROR",
                "detail": f"Database integrity violation {exc.orig}",
            },
        )

    @app.exception_handler(RequestValidationError)
    async def unexpected_validation_exception_handler(_, exc: RequestValidationError):
        logger.exception("Request Validation Error")
        detail = "Value Error: "
        for error in exc.errors():
            detail += error["msg"]
        return JSONResponse(
            status_code=400,
            content={
                "error": "VALIDATION_ERROR",
                "detail": detail,
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def unexpected_sqlalchemy_error_handler(_, exc: SQLAlchemyError):
        logger.exception("Unexpected DB Error")
        return JSONResponse(
            status_code=500,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "detail": "Something went wrong",
            },
        )

    @app.exception_handler(Exception)
    async def unexpected_handler(_, exc: Exception):
        logger.exception("Unexpected Error")
        return JSONResponse(
            status_code=500,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "detail": "Something went wrong",
            },
        )
