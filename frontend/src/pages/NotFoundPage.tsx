import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-rumbo-gray flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-fraunces font-bold text-rumbo-burgundy mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Página no encontrada</p>
        <Link to="/" className="btn-primary text-lg">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
