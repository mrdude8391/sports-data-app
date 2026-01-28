from fastapi import HTTPException

def create_athlete():
    try:
        return
    except ValueError as err:
        raise HTTPException(status_code=500, detail="Create Athlete Failed")