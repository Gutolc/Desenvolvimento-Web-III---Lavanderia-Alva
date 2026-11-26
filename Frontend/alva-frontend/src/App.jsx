import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginInterno from './pages/Login/LoginInterno'
import KanbanView from './pages/Kanban/KanbanView'
import CadastroFuncionario from './pages/Register/CadastroFuncionario'
import PrivateRoute from './routes/PrivateRoute'
import Checkout from './pages/Carrinho/Checkout' 

// FunÃ§Ã£o auxiliar movida para cÃ¡
function LoginRoute() {
    const { token } = useAuth()
    return token ? <Navigate to="/kanban" replace /> : <LoginInterno />
}

export default function App() {
    return (
                <Routes>
                    <Route path="/" element={<LoginRoute />} />
                    <Route path="/kanban" element={<PrivateRoute><KanbanView /></PrivateRoute>} />
                    <Route path="/cadastro-funcionario" element={<PrivateRoute><CadastroFuncionario /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/carrinho" element={<Checkout />} />
                </Routes>
    )
}
