from fastapi import APIRouter, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from token_manager import bearer, read_token

from applications.schemas import ApplicationBody
from applications.applications_repository import ApplicationsRepository
from mail.mail_base import MailSender




router = APIRouter(
    prefix="/apps",
    tags=["Applications"]
)

@router.get("/test")
async def test(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get('user_id')
    print(await ApplicationsRepository.get_head(user_id))

# @router.get("/get_statistic")
# async def get_statistic(token: HTTPAuthorizationCredentials = Security(bearer)):
#     info = read_token(token)
#     if info is None:
#         raise HTTPException(
#             status_code=401,
#             detail="Not authorized. Use /auth/login endpoint."
#         )
#     user_id = info.get('user_id')
    
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
            detail="Bad request."
        )
    return answer

@router.get("get_active_apps", status_code=200)
async def get_active_apps(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    role = info.get('role')
    if role is None or role < 2:
        raise HTTPException(
            status_code=403,
            detail="Forbidden. You are not head or admin."
        )
    user_id = info.get('user_id')
    answer = await ApplicationsRepository.get_active_apps(user_id)
    if answer is None:
        raise HTTPException(
            status_code=400,
            detail="Bad request."
        )
    return answer

@router.post("/approve", status_code=200)
async def change_status(app_id: int, status_id: int, token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401,
            detail="Not authorized. Use /auth/login endpoint."
        )
    role = info.get('role')
    if role is None or role < 2:
        raise HTTPException(
            status_code=403,
            detail="Forbidden. You are not head or admin."
        )
    change_error = await ApplicationsRepository.change_status(app_id, status_id)
    if change_error is not None:
        raise HTTPException(
            status_code=400,
            detail=change_error
        )


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
    head = await ApplicationsRepository.get_head(user_id)
    receiver = f"{head.get('first_name')} {head.get('second_name')} {head.get('patronymic')}".replace("None", "")
    # Uncomment it, when program will be ready. 
    # MailSender.send_new_apps_notification(head.get("email"), receiver, "http://localhost:3000/profile", head.get)
    
