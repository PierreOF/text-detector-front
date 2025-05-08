"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Code, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Sobre o Projeto
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Recolher" : "Expandir"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-3 text-gray-600 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium flex items-center mb-2 text-gray-700">
                <Code className="h-4 w-4 mr-2" />
                Tecnologias Utilizadas
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Frontend: React, Next.js e TailwindCSS</li>
                <li>Processamento de Imagem: OpenCV em Python</li>
                <li>Detecção de Texto: Algoritmos de Visão Computacional</li>
                <li>API: Integração entre frontend e backend para processamento</li>
              </ul>
            </div>

            <p>
              O sistema utiliza técnicas avançadas de Visão Computacional para identificar automaticamente áreas de
              texto em imagens escaneadas de redações. Isso permite a extração e posterior análise do conteúdo escrito.
            </p>

          </div>
        </CardContent>
      )}
    </Card>
  )
}
