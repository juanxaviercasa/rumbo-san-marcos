import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import HomePage from './pages/HomePage'
import DiagnosticPage from './pages/DiagnosticPage'
import ExamPage from './pages/ExamPage'
import ResultsPage from './pages/ResultsPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLayout from './components/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCareersPage from './pages/AdminCareersPage'
import AdminQuestionsPage from './pages/AdminQuestionsPage'
import AdminImportPage from './pages/AdminImportPage'
import AdminAuditPage from './pages/AdminAuditPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostico" element={<DiagnosticPage />} />
        <Route path="/examen/:attemptId" element={<ExamPage />} />
        <Route path="/resultados/:attemptId" element={<ResultsPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="carreras" element={<AdminCareersPage />} />
          <Route path="preguntas" element={<AdminQuestionsPage />} />
          <Route path="importar" element={<AdminImportPage />} />
          <Route path="auditoria" element={<AdminAuditPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  )
}

export default App
