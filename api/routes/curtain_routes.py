from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()

curtain_status = {"status": "stop"}
curtain_automatic = {"automatic_mode": "on"}

class CurtainCommand(BaseModel):
    command: Literal["open", "close", "stop"]

class AutomaticCommand(BaseModel):
    command: Literal["on", "off"]
    
@router.post("/", status_code=200)
def control_curtain(data: CurtainCommand):
    curtain_status['status'] = data.command.lower()
    return {"message": f"Curtain command received: {data.command}"}

@router.post("/automatic", status_code=200)
def manage_purifier(data: AutomaticCommand):
    curtain_automatic['automatic_mode'] = data.command.lower()
    return {"message": f"Automatic mode toggled: {data.command}"}

@router.get("/status")
def get_curtain_status():
    return {"status": curtain_status["status"]}

@router.get("/automatic")
def get_curtain_status():
    return {"automatic_mode": curtain_automatic["automatic_mode"]}