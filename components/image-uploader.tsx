"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Upload,
  ImageIcon,
  Loader2,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Download,
  FileJson,
  FileIcon as FilePdf,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NextImage from "next/image"
import { cn } from "@/lib/utils"

// Tipo para as estatísticas
type TextStats = {
  areasDetected: number
  totalArea: number
  textDensity: number
  confidence: number
  estimatedWords: number
}

// Tipo para o item do histórico
export type HistoryItem = {
  id: string
  originalImage: string
  processedImage: string
  timestamp: number
  stats: TextStats
}

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isPanning, setIsPanning] = useState(false)
  const [textStats, setTextStats] = useState<TextStats | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const originalImageRef = useRef<HTMLDivElement>(null)
  const processedImageRef = useRef<HTMLDivElement>(null)

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("imageHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Erro ao carregar histórico:", e)
      }
    }
  }, [])

  // Salvar histórico no localStorage quando mudar
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("imageHistory", JSON.stringify(history))
    }
  }, [history])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0]
      if (file.type.match("image/(jpeg|jpg|png)")) {
        processFile(file)
      }
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalImage(result)
      setProcessedImage(null)
      setTextStats(null)
      setZoomLevel(100)
    }
    reader.readAsDataURL(file)
  }

  const detectText = async () => {
    if (!originalImage) return

    setIsProcessing(true)

    // Simulando o processamento da imagem
    setTimeout(() => {
      const canvas = document.createElement("canvas")
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Desenha a imagem original
          ctx.drawImage(img, 0, 0)

          // Desenha retângulos simulando detecção de texto
          ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"
          ctx.lineWidth = 3

          // Simula 5-10 áreas de texto detectadas
          const numAreas = 5 + Math.floor(Math.random() * 6)
          const textAreas = []
          const totalImageArea = img.width * img.height
          let totalTextArea = 0

          for (let i = 0; i < numAreas; i++) {
            const x = Math.random() * (img.width - 200)
            const y = Math.random() * (img.height - 50)
            const width = 100 + Math.random() * 300
            const height = 20 + Math.random() * 40

            textAreas.push({ x, y, width, height })
            totalTextArea += width * height

            ctx.strokeRect(x, y, width, height)
          }

          const processedImageData = canvas.toDataURL("image/jpeg")
          setProcessedImage(processedImageData)

          // Calcular estatísticas
          const stats: TextStats = {
            areasDetected: numAreas,
            totalArea: Math.round(totalTextArea),
            textDensity: Math.round((totalTextArea / totalImageArea) * 100),
            confidence: Math.round(70 + Math.random() * 25),
            estimatedWords: Math.round(totalTextArea / 100),
          }

          setTextStats(stats)

          // Adicionar ao histórico
          const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            originalImage,
            processedImage: processedImageData,
            timestamp: Date.now(),
            stats,
          }

          setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)])

          setIsProcessing(false)
        }
      }

      img.src = originalImage
    }, 1500)
  }

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0])
  }

  const resetZoom = () => {
    setZoomLevel(100)
  }

  const togglePan = () => {
    setIsPanning(!isPanning)
  }

  const handleMouseDown = (e: React.MouseEvent, ref: typeof originalImageRef) => {
    if (!isPanning || !ref.current) return

    const startX = e.clientX
    const startY = e.clientY
    const scrollLeft = ref.current.scrollLeft
    const scrollTop = ref.current.scrollTop

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      ref.current.scrollLeft = scrollLeft - dx
      ref.current.scrollTop = scrollTop - dy
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const exportAsImage = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = `redacao-processada-${Date.now()}.jpg`
    link.click()
  }

  const exportAsJSON = () => {
    if (!textStats) return

    const data = {
      timestamp: new Date().toISOString(),
      statistics: textStats,
      imageInfo: {
        hasProcessedImage: !!processedImage,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `estatisticas-redacao-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportAsPDF = () => {
    // Simulação de exportação PDF
    alert("Em um ambiente de produção, esta função geraria um PDF com a imagem processada e estatísticas.")
  }

  const toggleFullscreen = (image: string) => {
    setFullscreenImage(fullscreenImage === image ? null : image)
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          originalImage ? "py-4" : "py-12",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="hidden" />

        {!originalImage ? (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">Arraste e solte sua imagem aqui</h3>
            <p className="text-sm text-gray-500 mb-3">ou clique para selecionar um arquivo</p>
            <p className="text-xs text-gray-400">Formatos suportados: .jpg, .jpeg, .png</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
            <p className="text-sm text-gray-500">Clique para selecionar outra imagem</p>
          </div>
        )}
      </div>

      {originalImage && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button onClick={detectText} disabled={isProcessing} className="bg-gray-600 hover:bg-gray-700">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Detectar Texto"
                )}
              </Button>

              {processedImage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportAsImage}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Exportar como Imagem
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsJSON}>
                      <FileJson className="h-4 w-4 mr-2" />
                      Exportar Estatísticas (JSON)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsPDF}>
                      <FilePdf className="h-4 w-4 mr-2" />
                      Gerar Relatório (PDF)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {processedImage && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={togglePan} className={isPanning ? "bg-gray-100" : ""}>
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetZoom}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="w-24">
                  <Slider value={[zoomLevel]} min={50} max={200} step={5} onValueChange={handleZoomChange} />
                </div>
                <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-500 w-12">{zoomLevel}%</span>
              </div>
            )}
          </div>

          <Tabs defaultValue="side-by-side">
            <TabsList className="mb-4">
              <TabsTrigger value="side-by-side">Lado a Lado</TabsTrigger>
              <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="side-by-side">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Imagem Original</h3>
                    <Button variant="ghost" size="icon" onClick={() => toggleFullscreen(originalImage)}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className="p-4 flex justify-center"
                    ref={originalImageRef}
                    onMouseDown={(e) => handleMouseDown(e, originalImageRef)}
                    style={{ cursor: isPanning ? "grab" : "default" }}
                  >
                    <div className="relative max-h-[400px] overflow-auto">
                      <NextImage
                        src={originalImage}
                        alt="Imagem original"
                        width={500}
                        height={300}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Texto Detectado</h3>
                    {processedImage && (
                      <Button variant="ghost" size="icon" onClick={() => toggleFullscreen(processedImage)}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div
                    className="p-4 flex justify-center"
                    ref={processedImageRef}
                    onMouseDown={(e) => handleMouseDown(e, processedImageRef)}
                    style={{ cursor: isPanning ? "grab" : "default" }}
                  >
                    {processedImage ? (
                      <div className="relative max-h-[400px] overflow-auto">
                        <img
                          src={processedImage || "/placeholder.svg"}
                          alt="Imagem processada"
                          style={{
                            maxWidth: "none",
                            width: `${zoomLevel}%`,
                            height: "auto",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                        {isProcessing ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>Processando imagem...</p>
                          </div>
                        ) : (
                          <p>Clique em "Detectar Texto" para processar a imagem</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="statistics">
              <Card>
                <div className="p-4">
                  {textStats ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Estatísticas da Detecção</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Áreas de Texto</div>
                          <div className="text-2xl font-semibold">{textStats.areasDetected}</div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Densidade de Texto</div>
                          <div className="text-2xl font-semibold">{textStats.textDensity}%</div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Confiança</div>
                          <div className="text-2xl font-semibold">{textStats.confidence}%</div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Palavras Estimadas</div>
                          <div className="text-2xl font-semibold">{textStats.estimatedWords}</div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Área Total (px²)</div>
                          <div className="text-2xl font-semibold">{textStats.totalArea.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Análise</h4>
                        <p className="text-sm text-blue-700">
                          A imagem contém {textStats.areasDetected} áreas de texto com uma densidade de{" "}
                          {textStats.textDensity}%. A confiança média da detecção é de {textStats.confidence}%, com
                          aproximadamente {textStats.estimatedWords} palavras.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-gray-400">
                      {isProcessing ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin mb-2" />
                          <p>Calculando estatísticas...</p>
                        </div>
                      ) : (
                        <p>Processe uma imagem para ver as estatísticas</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Modal de tela cheia */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={() => setFullscreenImage(null)}
            >
              <Minimize2 className="h-6 w-6" />
            </Button>

            <div className="overflow-auto max-h-full max-w-full">
              <img
                src={fullscreenImage || "/placeholder.svg"}
                alt="Visualização em tela cheia"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
