from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, recommend

app = FastAPI(title='face')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix='/analyze', tags=['analyze'])
app.include_router(recommend.router, prefix='/recommend', tags=['recommend'])

@app.get('/health')
def health():
    return {'status': 'ok'}