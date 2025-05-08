from pydantic import BaseModel

class AnaliseResposta(BaseModel):
    imagem_processada_base64: str
    areas_texto: int
    densidade_texto: float
    confianca: int
    area_total_px2: int
