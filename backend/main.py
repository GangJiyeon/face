import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import analyze, recommend, auth

app = FastAPI(title='face')

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix='/analyze', tags=['analyze'])
app.include_router(recommend.router, prefix='/recommend', tags=['recommend'])
app.include_router(auth.router, prefix='/auth', tags=['auth'])


@app.get('/health')
def health():
    return {'status': 'ok'}
