from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth_router

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
]

## CORS prevents client at a different origin from calling anything at the API url. localhost:5173 != localhost:8000 or in this case with uvicorn http://127.0.0.1:8000/
# we need to specify specific origin URL that is allowed to call from the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    print("Server Started")
    return {"message": "API is running..."}

@app.get("/test")
def test():
    return {"Test Response"}

# Include Routers
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app="main:app", host="0.0.0.0", port=os.getenv("SERVER_PORT"), reload=True)