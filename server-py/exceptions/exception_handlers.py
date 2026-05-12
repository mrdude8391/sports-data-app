from fastapi import FastAPI
from fastapi.responses import JSONResponse

from exceptions.errors import DuplicateUserError, InvalidCredentialsError

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(_, exc: InvalidCredentialsError):

            return JSONResponse(
                status_code=401,
                content={
                    "error": "INVALID_CREDENTIALS",
                    "message": "Invalid email or password"
                }
            )
    
    @app.exception_handler(DuplicateUserError)
    async def duplicate_user_handler(_, exc: DuplicateUserError):

            return JSONResponse(
                status_code=409,
                content={
                    "error": "DUPLICATE_USER",
                    "message": "Email already being used"
                }
            )
    
    @app.exception_handler(Exception)
    async def unexpected_handler(_, exc: Exception):

        return JSONResponse(
            status_code=500,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "message": "Something went wrong"
            }
        )