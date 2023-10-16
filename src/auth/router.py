from fastapi import APIRouter, HTTPException
from token_manager import create_access_token

from auth.auth_repository import AuthRepository as auth
from auth.schemas import UserLogin, UserRegister



router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
async def register(user_reg: UserRegister):
    if await auth.check_bad_license(user_reg.license):
        raise HTTPException(
            status_code=400,
            detail="LICENSE IS INCORRECT OR EXPIRED"
        )
    bundle = await auth.admin_register(dict(user_reg))
    if bundle is None:
        raise HTTPException(
            status_code=400,
            detail="ADMIN IS NOT REGISTERED"
        )
    bundle['token'] = create_access_token(data=bundle)
    return bundle
        



@router.post("/login")
async def login(user_log: UserLogin):
    user = await auth.get_user_db(user_log.email, user_log.password)
    if user is None:
        raise HTTPException(
            status_code=400,
            detail="LOGIN_BAD_CREDENTIALS"
        )
    print(user)
    user['token'] = create_access_token(data=user)
    return user
