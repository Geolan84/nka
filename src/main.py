from fastapi import FastAPI
import uvicorn

from auth.router import router as router_auth
from admin.router import router as router_admin


from fastapi import FastAPI


app = FastAPI(title="NKA")


@app.get("/")
def read_root():
    return "Hello from NKA API:)"

app.include_router(router=router_auth)
app.include_router(router=router_admin)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, log_level="info", reload=True)
