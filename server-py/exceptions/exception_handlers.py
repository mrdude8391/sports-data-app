import logging

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from exceptions.errors import DuplicateUserError, InvalidCredentialsError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(_, exc: InvalidCredentialsError):
            logger.exception("Invalid Credentials Error")
            return JSONResponse(
                status_code=401,
                content={
                    "error": "INVALID_CREDENTIALS",
                    "message": "Invalid email or password"
                }
            )
    
    @app.exception_handler(DuplicateUserError)
    async def duplicate_user_handler(_, exc: DuplicateUserError):
            logger.exception("Duplicate Error")
            return JSONResponse(
                status_code=409,
                content={
                    "error": "DUPLICATE_USER",
                    "message": "Email already being used"
                }
            )
    
    @app.exception_handler(RequestValidationError)
    async def unexpected_validation_exception_handler(_, exc: RequestValidationError):
        logger.exception("Request Validation Error")
        message = "Value Error: "
        for error in exc.errors():
            message += error['msg']
        return JSONResponse(
            status_code=400,
            content={
                "error": "VALIDATION_ERROR",
                "message": message,
            }
        )
    
    @app.exception_handler(Exception)
    async def unexpected_handler(_, exc: Exception):
        logger.exception("Unexpected Error")
        return JSONResponse(
            status_code=500,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "message": "Something went wrong"
            }
        )