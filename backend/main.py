from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from models import AnaliseResposta

from services import detectar_texto_base64 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImageBase64Request(BaseModel):
    imagem_base64: str

@app.post("/detectar-texto/", response_model=AnaliseResposta)
def detectar_texto_api(payload: ImageBase64Request):
    request = detectar_texto_base64(payload.imagem_base64)
    print(request)
    return request
