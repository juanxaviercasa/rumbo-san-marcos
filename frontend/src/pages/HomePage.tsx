import { Link } from 'react-router-dom'

const processSteps = [
  {
    number: '1',
    title: 'Elige tu carrera',
    description: 'Selecciona la ruta que te interesa y personalizamos el diagnóstico.',
  },
  {
    number: '2',
    title: 'Rinde el examen',
    description: 'Responde preguntas por área con lógica similar a la admisión.',
  },
  {
    number: '3',
    title: 'Mide tu brecha',
    description: 'Compara tu puntaje con el corte y identifica qué te falta.',
  },
  {
    number: '4',
    title: 'Sigue tu ruta',
    description: 'Recibe prioridades por tema para estudiar con mayor impacto.',
  },
]

const areaCards = [
  {
    code: 'A',
    title: 'Ciencias de la Salud',
    description: 'Biología, química y comprensión clínica.',
  },
  {
    code: 'B',
    title: 'Ciencias Básicas',
    description: 'Matemática, Física y análisis cuantitativo.',
  },
  {
    code: 'C',
    title: 'Ingenierías',
    description: 'Física, álgebra, geometría y lógica.',
  },
  {
    code: 'D',
    title: 'Económicas y Gestión',
    description: 'Matemática, lectura crítica y economía.',
  },
  {
    code: 'E',
    title: 'Humanidades y Sociales',
    description: 'Historia, lectura crítica y ciencias sociales.',
  },
]

const methodBullets = [
  'Modelamos la estructura del examen tipo UNMSM.',
  'Calculamos tu brecha frente al corte real de carreras.',
  'Diseñamos una ruta de estudio por prioridad y relevancia.',
]

const quickStats = [
  { value: '5', label: 'áreas' },
  { value: '40', label: 'carreras' },
  { value: '2000', label: 'puntos' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#1d1d1d]">
      <header className="border-b border-[#e7dfd7] bg-[#f5f1ec] text-[#1d1d1d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B1538] text-sm font-black text-white shadow-sm sm:h-11 sm:w-11">
                R
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-fraunces font-bold leading-none sm:text-xl">Rumbo San Marcos</div>
                <div className="text-[9px] uppercase tracking-[0.14em] text-[#6c6a67] sm:text-[10px]">Diagnóstico de admisión</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-[#2d2d2d] md:flex">
              <a href="#proceso" className="transition hover:text-[#8B1538]">Cómo funciona</a>
              <a href="#areas" className="transition hover:text-[#8B1538]">Áreas UNMSM</a>
              <a href="#metodo" className="transition hover:text-[#8B1538]">Método</a>
            </nav>

            <Link
              to="/diagnostico"
              className="inline-flex shrink-0 items-center rounded-full bg-[#8B1538] px-3 py-2.5 text-xs font-semibold !text-white shadow-sm transition hover:bg-[#700f2d] sm:px-5 sm:text-sm"
            >
              Iniciar diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-22 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="max-w-xl">
              <span className="mb-6 inline-flex rounded-full border border-[#d7b664] bg-[#f9f1d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7e5f1d]">
                Enfocado 100% en admisión
              </span>

              <h1 className="font-fraunces text-4xl leading-[0.97] text-[#1b1b1b] md:text-6xl lg:text-[4.2rem]">
                Descubre cuánto falta para entrar a San Marcos.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#4d4a45] md:text-lg">
                Un diagnóstico práctico y personalizado para medir tu nivel real, entender tu brecha y planear mejor tu preparación.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to="/diagnostico"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#8B1538] px-6 py-3.5 text-base font-semibold !text-white shadow-[0_16px_32px_rgba(139,21,56,0.22)] transition hover:bg-[#700f2d] sm:w-auto"
                >
                  Rendir diagnóstico
                </Link>
                <a
                  href="#proceso"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#8B1538] bg-transparent px-6 py-3.5 text-base font-semibold text-[#8B1538] transition hover:bg-[#8B1538] hover:text-white sm:w-auto"
                >
                  Ver proceso
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-5">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="min-w-[110px] rounded-2xl border border-[#e6ddd2] bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <div className="font-fraunces text-3xl font-bold text-[#8B1538]">{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#6d6964]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-[#8B1538]/10 blur-3xl" />
              <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-[#d5b55d]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-[#d8cfc5] bg-[#3d090f] p-3 shadow-[0_30px_70px_rgba(56,10,18,0.28)]">
                <img
                  src="/images/hero-student.webp"
                  alt="Estudiante con su diagnóstico y metas universitarias"
                  className="h-[540px] w-full rounded-[22px] object-cover"
                />

                <div className="absolute inset-x-8 bottom-7 rounded-2xl border border-[#eadfc9] bg-[#f7f1ea]/95 px-5 py-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#6c6a67]">Te faltan</div>
                      <div className="mt-1 text-3xl font-fraunces font-bold text-[#8B1538]">357</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#6c6a67]">Puntaje</div>
                      <div className="mt-1 text-xl font-semibold text-[#1d1d1d]">1540</div>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-[#e5d8ca] pt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5d5854]">
                    Para alcanzar vacante en Medicina
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proceso" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#7f7a75]">El proceso</div>
            <h2 className="font-fraunces text-4xl leading-tight text-[#1c1c1c] md:text-5xl">
              De la duda al plan real, en cuatro pasos.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-[24px] border border-[#e7dfd7] bg-white p-5 shadow-[0_16px_38px_rgba(29,17,20,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(29,17,20,0.08)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1538] text-lg font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-fraunces text-[#1d1d1d]">{step.title}</h3>
                <p className="text-sm leading-6 text-[#56534f]">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="areas" className="bg-[#f1eee8] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#7f7a75]">Áreas</div>
              <h2 className="font-fraunces text-4xl leading-tight text-[#1d1d1d] md:text-5xl">
                Cada carrera tiene su propio perfil. Te evaluamos según ese perfil.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {areaCards.map((area) => (
                <article
                  key={area.code}
                  className="flex h-full min-h-[240px] flex-col rounded-[24px] border border-[#e5ddd4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f6ead7] font-fraunces text-xl font-bold text-[#8B1538]">
                    {area.code}
                  </div>
                  <h3 className="mb-3 text-xl font-fraunces leading-tight text-[#1d1d1d] sm:min-h-[96px]">
                    {area.title}
                  </h3>
                  <p className="mt-auto text-sm leading-6 text-[#56534f]">{area.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_1fr]">
            <div className="overflow-hidden rounded-[30px] border border-[#e6dcd4] bg-[#f3efe9] p-3 shadow-[0_18px_40px_rgba(32,16,19,0.08)]">
              <img
                src="/images/method-student.webp"
                alt="Estudiante estudiando con enfoque y estrategia"
                className="h-[430px] w-full rounded-[22px] object-cover"
              />
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#7f7a75]">Método</div>
              <h2 className="font-fraunces text-4xl leading-tight text-[#1d1d1d] md:text-5xl">
                Estudia con estrategia, no a ciegas.
              </h2>

              <ul className="mt-8 space-y-5">
                {methodBullets.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-[#3c3834]">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8B1538] text-sm text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#520d1f] px-6 py-12 text-center text-white shadow-[0_26px_60px_rgba(49,12,18,0.25)] md:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f4d7d7]">Tu próximo paso</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-fraunces text-4xl leading-tight md:text-5xl">
              La universidad empieza por saber dónde estás hoy.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#f3d7d7]">
              Obtén una mirada clara de tu nivel, identifica la brecha real y diseña una preparación con dirección.
            </p>
            <Link
              to="/diagnostico"
              className="mt-8 inline-flex items-center rounded-full bg-[#d4af37] px-8 py-3.5 text-base font-bold text-[#2b0d11] transition hover:bg-[#caa62a]"
            >
              Comenzar ahora
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#171213] text-[#f5f1ec]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B1538] text-sm font-bold text-white">R</div>
                <div>
                  <div className="text-xl font-fraunces font-bold">Rumbo San Marcos</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#c8c0b9]">Diagnóstico de admisión</div>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#d7d0ca]">
                Diagnóstico y guía de preparación para postulantes que buscan claridad y dirección antes de la universidad.
              </p>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#d7d0ca]">Plataforma</div>
              <ul className="space-y-2 text-sm text-[#f0ebe7]">
                <li>Cómo funciona</li>
                <li>Áreas UNMSM</li>
                <li>Rendir diagnóstico</li>
              </ul>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#d7d0ca]">Importante</div>
              <p className="text-sm leading-6 text-[#d7d0ca]">
                Los puntajes y cortes son referenciales para orientar tu preparación y poner foco en las áreas que más impactan.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-[#3a2a2f] pt-6 text-center text-xs text-[#d7d0ca]">
            © 2026 Rumbo San Marcos. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
