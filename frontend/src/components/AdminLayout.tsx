import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/carreras', label: 'Carreras' },
  { to: '/admin/preguntas', label: 'Preguntas' },
  { to: '/admin/importar', label: 'Importar' },
  { to: '/admin/auditoria', label: 'Auditoría' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-slate-900 text-white p-5">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Rumbo</p>
            <h1 className="mt-2 text-2xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-rose-700 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
