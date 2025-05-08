# Detecção de Texto em Imagens - FastAPI

Este projeto utiliza FastAPI para criar uma API de detecção de áreas de texto manuscritas em imagens, processando-as e retornando informações sobre as áreas de texto encontradas.

## Funcionalidades

* **Base64 para Imagem**: Converte uma imagem no formato base64 para uma matriz NumPy para processamento.
* **Imagem para Base64**: Converte a imagem processada de volta para o formato base64 para envio de resposta.
* **Detecção de Texto**: Utiliza contornos para identificar e destacar áreas de texto manuscritas em imagens.
* **Cálculo de Análises**: Calcula o número de áreas de texto, a densidade de texto e uma pontuação de confiança com base na área total da imagem e a área ocupada por texto.
* **Ajuste de Orientação**: Ajusta a orientação da imagem para garantir que ela esteja na posição correta.

## Requisitos

* Python 3.7+
* FastAPI
* Uvicorn
* OpenCV
* NumPy

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/PierreOF/text-detector-front/
   cd text-detector-front
   ```

2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

## Executando o Servidor

Para rodar o servidor FastAPI localmente:

```bash
fastapi run main.py
```

O servidor estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Endpoints

### POST /detectar-texto

Detecta as áreas de texto em uma imagem enviada no formato base64.

#### Corpo da Requisição

```json
{
  "imagem_base64": "string (imagem base64)"
}
```

#### Resposta

```json
{
  "imagem_processada_base64": "string (imagem processada em base64)",
  "areas_texto": 5,
  "densidade_texto": 23.45,
  "area_total_px2": 80000
}
```

### Parâmetros

* `imagem_base64`: Imagem codificada em base64.

### Exemplo de uso com `curl`

Para testar a API usando `curl`, envie uma imagem em base64 para o endpoint:

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/detectar-texto' \
  -H 'Content-Type: application/json' \
  -d '{
  "imagem_base64": "aqui-vai-o-seu-base64-da-imagem"
}'
```

## Instalando dependências do frontend

```bash
npm i
```

## Executando o Frontend

```bash
npm run dev
```


## Como o Código Funciona

### Função `base64_para_imagem`

Converte uma imagem codificada em base64 para uma matriz NumPy que pode ser processada pelo OpenCV.

### Função `imagem_para_base64`

Converte uma imagem processada de volta para o formato base64 para ser retornada na resposta da API.

### Função `calcular_analises`

Calcula o número de áreas de texto detectadas, a densidade de texto (como uma porcentagem da área da imagem) e uma pontuação de confiança com base nesses cálculos.

### Função `ajustar_orientacao`

Verifica a orientação da imagem e a ajusta para que a largura seja maior que a altura, garantindo que o texto seja processado corretamente.

### Função `detectar_texto_base64`

Este é o ponto de entrada para a API. Ele converte a imagem de base64, ajusta sua orientação, a converte para escala de cinza, aplica uma binarização adaptativa para identificar os contornos e calcula as análises.

## Testes

Os testes podem ser realizados diretamente com as ferramentas de teste do FastAPI ou utilizando o Swagger UI integrado, acessível em:

```
http://127.0.0.1:8000/docs
```

## Teste frontend 

```
http://localhost:3000
```


---
