"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Clock, RotateCcw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { HistoryItem } from "./image-uploader"

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Evitar erros de hidratação
  useEffect(() => {
    setIsClient(true)

    // Carregar histórico do localStorage
    const savedHistory = localStorage.getItem("imageHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Erro ao carregar histórico:", e)
      }
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("imageHistory")
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const loadImage = (item: HistoryItem) => {
    // Simular o carregamento da imagem do histórico
    // Em um cenário real, isso poderia disparar um evento ou usar um contexto global
    const event = new CustomEvent("loadHistoryImage", { detail: item })
    window.dispatchEvent(event)

    // Alternativa: recarregar a página com parâmetros
    alert(`Em um ambiente de produção, esta ação carregaria a imagem do histórico: ${formatDate(item.timestamp)}`)
  }

  if (!isClient) {
    return null // Evitar renderização no servidor
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Histórico de Processamento
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={history.length === 0}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja apagar todo o histórico de imagens processadas? Esta ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>Limpar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>Nenhuma imagem processada</p>
            <p className="mt-1 text-xs">As imagens processadas aparecerão aqui</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3 mb-2">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.processedImage || "/placeholder.svg"}
                        alt="Miniatura"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="text-xs text-gray-500 mb-1">{formatDate(item.timestamp)}</div>

                      <div className="flex flex-wrap gap-1 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.stats.areasDetected} áreas
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.stats.textDensity}% densidade
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs mt-1 px-2"
                        onClick={() => loadImage(item)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Recarregar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
