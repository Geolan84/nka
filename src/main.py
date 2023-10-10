from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from auth.router import router as router_auth
from admin.router import router as router_admin

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app = FastAPI(title="NKA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return "Hello from NKA API:)"

app.include_router(router=router_auth)
app.include_router(router=router_admin)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, log_level="info", reload=True)
