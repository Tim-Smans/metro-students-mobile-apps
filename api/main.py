from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import curtain_routes, purifier_routes

app = FastAPI(
  title="Automatic Air Purifier & Curtain API", 
  version="1.0.1",
)


app.include_router(curtain_routes.router, prefix="/curtain", tags=["Automatic Curtains"])
app.include_router(purifier_routes.router, prefix="/purifier", tags=["Automatic Air purifier"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
