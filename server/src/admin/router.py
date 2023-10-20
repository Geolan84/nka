from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import Response
from config import ADMIN_PASS


from admin.admin_repository import AdminRepository as admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/get_new_code")
async def get_new_code(password: str):
    if password is None or password != ADMIN_PASS:
        raise HTTPException(
            status_code=403,
            detail="unauthorized access"
        )
    new_code = await admin.get_new_code()
    return {'Your new license': new_code}
