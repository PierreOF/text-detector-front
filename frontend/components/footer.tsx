import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Detector de Texto em Redações</p>
          </div>

          <div className="flex items-center">
            <a
              href="https://github.com/seu-usuario/detector-texto-redacoes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>Repositório no GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
