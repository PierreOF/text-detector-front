import type { Metadata } from "next"
import ImageUploader from "@/components/image-uploader"
import AboutSection from "@/components/about-section"
import Footer from "@/components/footer"
import HistoryPanel from "@/components/history-panel"

export const metadata: Metadata = {
  title: "Detector de Texto em Redações",
  description: "Sistema de detecção automática de áreas de texto em imagens de redações",
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Detector de Texto em Redações</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Envie uma imagem escaneada de uma redação e visualize automaticamente as áreas de texto destacadas.
          </p>
        </div>

        {/* Componente principal */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <ImageUploader />
        </div>

        {/* Histórico e Sobre o Projeto em layout de duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <HistoryPanel />
          </div>
          <div>
            <AboutSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
