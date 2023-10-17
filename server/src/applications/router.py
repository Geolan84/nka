from fastapi import APIRouter, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from token_manager import bearer, read_token

from applications.schemas import ApplicationBody
from applications.applications_repository import ApplicationsRepository




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
    
@router.get("/get_apps", status_code=200)
async def get_applications(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get('user_id')
    answer = await ApplicationsRepository.get_applications(user_id)
    if answer is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    return answer

@router.post("/new_app", status_code=201)
async def new_application(app_body: ApplicationBody, token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get('user_id')
    add_error = await ApplicationsRepository.add_application(user_id, app_body)
    if add_error is not None:
        raise HTTPException(
            status_code=400,
            detail=add_error
        )
