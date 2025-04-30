from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

purifier_status = {"status": "on"}
quality_status = {"air": "good"}
class PurifierCommand(BaseModel):
    command: Literal["on", "off"]

class QualityCommand(BaseModel):
    command: Literal["good", "bad"]
    
@router.post("/", status_code=200)
def manage_purifier(data: PurifierCommand):
    purifier_status['status'] = data.command.lower()
    return {"message": f"Purifier command received: {data.command}"}

@router.post("/quality", status_code=200)
def update_air_quality(data: QualityCommand):
    quality_status['air'] = data.command.lower()
    return {"message": f"Air quality command received: {data.command}"}


@router.get("/status")
def get_purifier_status():
    return {"status": purifier_status["status"]}

@router.get("/quality")
def get_air_quality():
    return {"air_quality": quality_status["air"]}