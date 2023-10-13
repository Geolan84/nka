from fastapi import APIRouter, status, Depends, HTTPException

from forms.forms_repository import FormsRepository as FormsRepository




router = APIRouter(
    prefix="/forms",
    tags=["Forms"]
)

# @router.post("/add_form")
# async def register(user_reg: UserRegister):
#     if await auth.check_bad_license(user_reg.license):
#         raise HTTPException(
#             status_code=400,
#             detail="LICENSE IS INCORRECT OR EXPIRED"
#         )
#     bundle = await auth.admin_register(dict(user_reg))
#     if bundle is None:
#         raise HTTPException(
#             status_code=400,
#             detail="ADMIN IS NOT REGISTERED"
#         )
#     bundle['token'] = create_access_token(data=bundle)
#     return bundle
        
