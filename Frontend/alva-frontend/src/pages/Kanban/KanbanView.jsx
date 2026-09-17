import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function KanbanView() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    return (
        <main className="min-h-screen bg-blue-50 text-slate-800">
            <header className="flex justify-between items-center px-[7%] py-5 bg-white border-b border-sky-400">
                <strong className="text-sky-600 text-[26px] tracking-[4px]">ALVA</strong>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/cadastro-funcionario')}
                        className="border-0 rounded-md px-5 py-2.5 bg-sky-100 text-sky-700 font-bold cursor-pointer hover:bg-sky-200 transition-colors"
                    >
                        Novo Colaborador
                    </button>
                    <button
                        type="button"
                        onClick={logout}
                        className="border-0 rounded-md px-5 py-2.5 bg-sky-600 text-white font-bold cursor-pointer hover:bg-sky-700 transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </header>
            
            <section className="max-w-[960px] mx-auto px-[7%] pt-[72px]">
                <p className="text-sky-600 text-xs font-extrabold tracking-[2px]">
                    PAINEL OPERACIONAL
                </p>
                
                <h1 className="text-sky-600 my-3.5 text-[clamp(28px,5vw,48px)] leading-[1.1]">
                    Bem-vindo ao Kanban - Rota Protegida
                </h1>
                
                <p className="text-slate-800 opacity-75">
                    Acompanhe os pedidos e o fluxo de trabalho da lavanderia.
                </p>
            </section>
        </main>
    )
}