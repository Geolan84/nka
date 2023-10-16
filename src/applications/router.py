from fastapi import APIRouter, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from token_manager import bearer, read_token
from applications.schemas import ApplicationBody



router = APIRouter(
    prefix="/apps",
    tags=["Applications"]
)

@router.get("/get_statistic")
async def get_statistic(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get('user_id')
    


@router.post("/new_app", status_code=201)
async def new_app(app_body: ApplicationBody, token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get('user_id')

    print(info)
    print(app_body)