from fastapi import APIRouter, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from token_manager import bearer, read_token


from dashboard.dashboard_repository import DashboardRepository


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/get_one_level", status_code=200)
async def get_one_level(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    return await DashboardRepository.get_one_level_vacation(user_id)
