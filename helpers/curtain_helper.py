from typing import Literal
from requests import post, get

BASE_URL = "https://metro-students-mobile-apps.onrender.com"
headers = {
    "Content-Type": "application/json"
}

def is_curtain_manual():
  """
  Checks if the curtain is currently in manual mode.

  Returns:
    bool: True if the curtain is in manual mode, False if it is not, or if the API requests fails.
  """
  response = get(f"{BASE_URL}/curtain/automatic/", headers=headers)
  
  if response.status_code != 200:
    return False
  
  return response.json()["automatic_mode"] == "off"

def get_curtain_status() -> Literal["open", "close", "stop"]:
  """
  Gets the current status of the curtain.

  Returns:
    "open", "close" or "stop": The current status of the curtain.

  Raises:
    Exception: If the API request fails.
    ValueError: If the returned status is not one of 'open', 'close', or 'stop'.
  """
  response = get(f"{BASE_URL}/curtain/status/", headers=headers)

  if response.status_code != 200:
    raise Exception("Failed to get curtain status")
  
  status = response.json()["status"]

  if status not in ["open", "close", "stop"]:
    raise ValueError(f"Invalid curtain status: {status}")

  return status


print(get_curtain_status())