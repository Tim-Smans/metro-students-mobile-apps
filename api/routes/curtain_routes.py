from typing import Literal
from fastapi import APIRouter, Path
from pydantic import BaseModel

router = APIRouter()

curtain_status = {}
curtain_automatic = {}

class CurtainCommand(BaseModel):
    command: Literal["open", "close", "stop"]

class AutomaticCommand(BaseModel):
    command: Literal["on", "off"]

@router.post("/{device_id}/manual", status_code=200)
def control_curtain(device_id: str, data: CurtainCommand):
    curtain_status[device_id] = data.command.lower()
    return {"message": f"Curtain command for {device_id}: {data.command}"}

@router.post("/{device_id}/automatic", status_code=200)
def manage_sensors(device_id: str, data: AutomaticCommand):
    curtain_automatic[device_id] = data.command.lower()
    return {"message": f"Automatic mode for {device_id}: {data.command}"}

@router.get("/{device_id}/manual")
def sensor_status(device_id: str):
    return {"manual_command": curtain_status.get(device_id, "unknown")}

@router.get("/{device_id}/automatic")
def get_automatic_mode(device_id: str):
    return {"sensors_enabled": curtain_automatic.get(device_id, "unknown")}