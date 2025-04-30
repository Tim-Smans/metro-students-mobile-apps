from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()

curtain_status = {"status": "stop"}
class CurtainCommand(BaseModel):
    command: Literal["open", "close", "stop"]
    
@router.post("/", status_code=200)
def control_curtain(data: CurtainCommand):
    curtain_status['status'] = data.command.lower()
    return {"message": f"Curtain command received: {data.command}"}

@router.get("/status")
def get_curtain_status():
    return {"status": curtain_status["status"]}