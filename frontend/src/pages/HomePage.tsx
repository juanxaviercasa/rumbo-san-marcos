import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-rumbo-burgundy text-white">
        <div className="container-custom py-4 flex justify-between items-center">
          <h1 className="text-2xl font-fraunces">Rumbo San Marcos</h1>
          <div className="space-x-4">
            <a href="#features" className="hover:text-rumbo-gold">Características</a>
            <a href="#about" className="hover:text-rumbo-gold">Sobre</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-fraunces font-bold text-rumbo-burgundy mb-6">
            Diagnóstico Adaptativo para UNMSM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Evalúate con el nivel exacto de tu carrera. Descubre tu brecha de puntaje y obtén una ruta de estudio personalizada.
          </p>
          <Link to="/diagnostico" className="btn-primary text-lg inline-block">
            Comenzar Evaluación
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-rumbo-gray py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-fraunces font-bold text-center mb-12">Cómo Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="card text-center">
              <div className="bg-rumbo-burgundy text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-3">Registro</h3>
              <p className="text-gray-600">Selecciona tu carrera y el sistema mapea tu bloque automáticamente.</p>
            </div>

            {/* Step 2 */}
            <div className="card text-center">
              <div className="bg-rumbo-burgundy text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-3">Evaluación</h3>
              <p className="text-gray-600">Resuelve un examen personalizado con cronómetro estricto.</p>
            </div>

            {/* Step 3 */}
            <div className="card text-center">
              <div className="bg-rumbo-burgundy text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-3">Resultados</h3>
              <p className="text-gray-600">Visualiza tu puntaje vs. el corte referencial con medidor visual.</p>
            </div>

            {/* Step 4 */}
            <div className="card text-center">
              <div className="bg-rumbo-burgundy text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-3">Plan</h3>
              <p className="text-gray-600">Recibe una ruta de estudio priorizada por impacto en tu carrera.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-rumbo-burgundy text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-fraunces font-bold mb-6">¿Listo para saber tu nivel real?</h2>
          <p className="text-xl mb-8 opacity-90">
            Acceso gratuito • Sin requisitos previos • Resultados al instante
          </p>
          <Link to="/diagnostico" className="bg-white text-rumbo-burgundy hover:bg-rumbo-gold px-8 py-4 rounded-lg font-bold text-lg inline-block transition-all">
            Iniciar Diagnóstico
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-custom text-center">
          <p>&copy; 2026 Rumbo San Marcos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
