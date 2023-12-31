from fastapi import APIRouter, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from token_manager import bearer, read_token
from config import ApplicationStatus
from datetime import date
import os
import time
from fastapi.responses import Response, FileResponse

from applications.schemas import ApplicationBody
from applications.applications_repository import ApplicationsRepository
from mail.mail_base import MailSender

from applications.converter import convert_app_to_pdf


router = APIRouter(prefix="/apps", tags=["Applications"])


@router.get("/get_apps", status_code=200)
async def get_applications(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    answer = await ApplicationsRepository.get_applications(user_id)
    if answer is None:
        raise HTTPException(status_code=401, detail="Bad request.")
    return answer


@router.get("/get_active_apps", status_code=200)
async def get_active_apps(token: HTTPAuthorizationCredentials = Security(bearer)):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    role = info.get("role")
    if role is None or role < 2:
        raise HTTPException(
            status_code=403, detail="Forbidden. You are not head or admin."
        )
    user_id = info.get("user_id")
    answer = await ApplicationsRepository.get_active_apps(user_id)
    if answer is None:
        raise HTTPException(status_code=400, detail="Bad request.")
    return answer


@router.post("/approve", status_code=200)
async def change_status(
    app_id: int, status_id: int, token: HTTPAuthorizationCredentials = Security(bearer)
):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    role = info.get("role")
    if role is None or role < 2:
        raise HTTPException(
            status_code=403, detail="Forbidden. You are not head or admin."
        )
    next_head = await ApplicationsRepository.get_head(user_id)
    if status_id == ApplicationStatus.PROCESSING and next_head is None:
        status_id = ApplicationStatus.ACCESSED

    change_error = await ApplicationsRepository.change_status(
        app_id, status_id, user_id
    )
    if status_id != ApplicationStatus.PROCESSING:
        user = await ApplicationsRepository.get_author(app_id)
        receiver = f"{user.get('second_name')} {user.get('first_name')} {user.get('patronymic')}".replace(
            "None", "".rstrip()
        )
        print(receiver, user.get("email"))
        MailSender.send_status_updated(
            user.get("email"), "http://localhost:3000/my-plan", receiver
        )
    if change_error is not None:
        raise HTTPException(status_code=400, detail=change_error)


@router.get("/get_accepted_pdf", status_code=200)
async def get_accepted_vacation(
    app_id: int, head_id: int, token: HTTPAuthorizationCredentials = Security(bearer)
):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    data = await ApplicationsRepository.get_exist_print(app_id, user_id, head_id)
    sault = f"{user_id}{int(time.time())}"
    try:
        convert_app_to_pdf(sault, data)
    except:
        raise HTTPException(status_code=400, detail="Exception. PDF can not be formed!")
    if os.path.isfile(f"vacations/Vacation{sault}.pdf"):
        return FileResponse(
            path=f"vacations/Vacation{sault}.pdf",
            filename=f"ЗаявлениеНаОтпуск.pdf",
            media_type="multipart/form-data",
        )
    return Response(status_code=400)


@router.get("/get_another_pdf", status_code=200)
async def get_pdf(
    head_id: int,
    type_id: int,
    start_date: date,
    end_date: date,
    token: HTTPAuthorizationCredentials = Security(bearer),
):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    data = await ApplicationsRepository.get_print_data(
        type_id, start_date, end_date, user_id, head_id
    )

    sault = f"{user_id}{int(time.time())}"
    try:
        convert_app_to_pdf(sault, data)
    except:
        raise HTTPException(status_code=400, detail="Exception. PDF can not be formed!")
    if os.path.isfile(f"vacations/Vacation{sault}.pdf"):
        return FileResponse(
            path=f"vacations/Vacation{sault}.pdf",
            filename=f"ЗаявлениеНаОтпуск.pdf",
            media_type="multipart/form-data",
        )
        # os.remove(f"vacations/Vacation{sault}.pdf")
    return Response(status_code=400)


@router.post("/new_app", status_code=201)
async def new_application(
    app_body: ApplicationBody, token: HTTPAuthorizationCredentials = Security(bearer)
):
    info = read_token(token)
    if info is None:
        raise HTTPException(
            status_code=401, detail="Not authorized. Use /auth/login endpoint."
        )
    user_id = info.get("user_id")
    add_error = await ApplicationsRepository.add_application(user_id, app_body)
    if add_error is not None:
        raise HTTPException(status_code=400, detail=add_error)
    head = await ApplicationsRepository.get_head(user_id)
    receiver = f"{head.get('first_name')} {head.get('second_name')} {head.get('patronymic')}".replace(
        "None", "".rstrip()
    )
    # Uncomment it, when program will be ready.
    # MailSender.send_new_apps_notification(head.get("email"), receiver, "http://localhost:3000/profile", head.get)
