from fastapi import APIRouter, Path, status, Depends, HTTPException
from fastapi.responses import Response

from structure.struct_repository import StructRepository as struct
from structure.schemas import NewUser, PatchUser



router = APIRouter(
    prefix="/struct",
    tags=["Structure"]
)

@router.post("/new_department", status_code=201)
async def add_department(department_name: str, head_department_id: int | None = None):
    department_error = await struct.add_department(department_name, head_department_id)
    if department_error is not None:
        raise HTTPException(status_code=400, detail=str(department_error))
    
    
@router.patch("/edit_department", status_code=200)
async def edit_department(new_name: str, department_id: int):
    department_error = await struct.edit_department(department_id, new_name)
    if department_error is not None:
        raise HTTPException(status_code=400, detail=department_error)
    

@router.get("/get_department", status_code=200)
async def get_structure(department_id: int | None = None):
    try:
        res = await struct.get_department(department_id)
        return res
    except Exception:
        pass
    
    
    
@router.delete("/delete_department", status_code=200)
async def delete_department(department_id: int):
    department_error = await struct.delete_department(department_id)
    if department_error is not None:
        raise HTTPException(status_code=400, detail=department_error)

@router.post("/add_user", status_code=201)
async def add_user(new_user: NewUser):
    add_error = await struct.add_new_user(dict(new_user))
    if add_error is not None:
        raise HTTPException(status_code=400, detail=str(add_error))
    
@router.get("/get_user", status_code=200)
async def add_user(user_id: int):
    try:
        return await struct.get_user(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="No user with this ID")

# @router.patch("/edit_user", status_code=200)
# async def edit_user(patch_user: PatchUser):
#     edit_error = await struct.edit_user(dict(patch_user))
#     if edit_error is not None:
#         raise HTTPException(status_code=400, detail=str(edit_error))