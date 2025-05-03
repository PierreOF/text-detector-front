import cv2
import numpy as np
import base64

def base64_para_imagem(imagem_base64: str) -> np.ndarray:
    imagem_bytes = base64.b64decode(imagem_base64)
    np_arr = np.frombuffer(imagem_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def imagem_para_base64(imagem: np.ndarray) -> str:
    _, buffer = cv2.imencode('.jpg', imagem)
    return base64.b64encode(buffer).decode('utf-8')

def calcular_analises(imagem, imagem_cinza, contornos) -> dict:
    altura, largura = imagem.shape[:2]
    area_total_img = altura * largura

    area_ocupada = 0
    caixas_validas = 0

    for contorno in contornos:
        x, y, w, h = cv2.boundingRect(contorno)
        if w > 50 and h > 15:
            caixas_validas += 1
            area = w * h
            area_ocupada += area

    densidade_texto = area_ocupada / area_total_img if area_total_img > 0 else 0
    confianca = min(100, int((densidade_texto * 100) + 20))

    return {
        "areas_texto": caixas_validas,
        "densidade_texto": round(densidade_texto * 100, 2),
        "confianca": confianca,
        "area_total_px2": area_total_img
    }

def detectar_texto_base64(imagem_base64: str) -> dict:
    imagem = base64_para_imagem(imagem_base64)
    imagem_cinza = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

    binaria = cv2.adaptiveThreshold(imagem_cinza, 255,
                                    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                    cv2.THRESH_BINARY_INV, 11, 2)

    contornos, _ = cv2.findContours(binaria, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Desenhar caixas
    for contorno in contornos:
        x, y, w, h = cv2.boundingRect(contorno)
        if w > 50 and h > 15:
            cv2.rectangle(imagem, (x, y), (x + w, y + h), (0, 255, 0), 2)

    imagem_processada_base64 = imagem_para_base64(imagem)
    analises = calcular_analises(imagem, imagem_cinza, contornos)

    return {
        "imagem_processada_base64": imagem_processada_base64,
        **analises
    }
