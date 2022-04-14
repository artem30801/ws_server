import json
import secrets
from typing import List

from fastapi import Depends, FastAPI, Request, WebSocket, WebSocketDisconnect, HTTPException, status
from fastapi.responses import HTMLResponse

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from pydantic import BaseModel

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
security = HTTPBasic()

with open("auth.json", "r") as f:
    all_credentials = json.load(f)


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    for username, password in all_credentials:
        correct_username = secrets.compare_digest(credentials.username, username)
        correct_password = secrets.compare_digest(credentials.password, password)

        if correct_username and correct_password:
            break

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def broadcast(self, message_type, content: dict):
        message = dict(type=message_type, content=content)
        living_connections = []
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_json(json_message)
            websocket = self.connections.pop()
            await websocket.send_json(message)
            living_connections.append(websocket)
        self.connections = living_connections

        # for connection in self.connections:
        #     await connection.send_json(json_message)


manager = ConnectionManager()


@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    context = {'request': request}
    return templates.TemplateResponse("display.html", context)


class DetectedReport(BaseModel):
    item: str
    coordinates: list[float, float, float]
    section: int
    correct: bool


@app.post("/storage/report/detected")
async def detected_report(report: DetectedReport, username: str = Depends(get_current_username)):
    response = report.dict()
    response["sender"] = username
    await manager.broadcast("detected", response)


@app.post("/storage/report/total/{section}")
async def total_report(section: int, count: int, username: str = Depends(get_current_username)):
    response = {"section": section, "count": count}
    await manager.broadcast("total", response)


@app.post("/storage/report/total/clear")
async def total_clear(username: str = Depends(get_current_username)):
    await manager.broadcast("total_clear", {})


@app.websocket("/ws/connect")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    print("DISCONNECT")
