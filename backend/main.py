from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import base64
from models import AnaliseResposta

from services import detectar_texto_base64 

app = FastAPI()

class ImageBase64Request(BaseModel):
    imagem_base64: str

@app.post("/detectar-texto/", response_model=AnaliseResposta)
def detectar_texto_api(payload: ImageBase64Request):
    return detectar_texto_base64(payload.imagem_base64)
