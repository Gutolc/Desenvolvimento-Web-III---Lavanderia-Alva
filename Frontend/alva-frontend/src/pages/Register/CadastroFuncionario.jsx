import { useState } from 'react'
import { cadastrarUsuario } from '../../services/usuarioService'

export default function CadastroFuncionario() {
    // Inicializamos o perfil com 'ATENDENTE' para o <select> já vir preenchido
    const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'ATENDENTE' })
    
    // Transformei o status em objeto para podermos pintar de verde (sucesso) ou vermelho (erro)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = ({ target }) => {
        setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setStatus({ type: '', message: '' })
        setLoading(true)

        try {
            await cadastrarUsuario(form.nome, form.email, form.senha, form.perfil)
            setForm({ nome: '', email: '', senha: '', perfil: 'ATENDENTE' })
            setStatus({ type: 'success', message: 'Funcionário cadastrado com sucesso!' })
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Erro ao cadastrar funcionário.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-blue-50 text-slate-800 flex justify-center items-center p-6 box-border">
            <section className="w-full max-w-[500px] p-10 bg-white box-border rounded-xl shadow-[0_18px_45px_rgba(30,41,59,0.12)]">
                
                <p className="text-sky-400 mb-2 text-[11px] font-bold tracking-[1.8px] text-center">
                    SISTEMA INTERNO
                </p>
                <h1 className="text-sky-600 m-0 text-3xl font-bold leading-tight text-center mb-8">
                    Novo Colaborador
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="text-slate-800 text-[13px] font-bold mt-1">
                        Nome Completo
                        <input 
                            name="nome" 
                            value={form.nome} 
                            onChange={handleChange} 
                            placeholder="Ex: Maria Silva"
                            required 
                            className="w-full p-3 border border-sky-400 rounded-md text-[15px] outline-none focus:border-sky-600 font-normal mt-1"
                        />
                    </label>
                    
				
                    <label className="text-slate-800 text-[13px] font-bold mt-1">
                        E-mail de Acesso
                        <input 
                            type="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange} 
                            placeholder="colaborador@alva.com"
                            required 
                            className="w-full p-3 border border-sky-400 rounded-md text-[15px] outline-none focus:border-sky-600 font-normal mt-1"
                        />
                    </label>
                    
                    <label className="text-slate-800 text-[13px] font-bold mt-1">
                        Senha Provisória
                        <input 
                            type="password" 
                            name="senha" 
                            value={form.senha} 
                            onChange={handleChange} 
                            placeholder="Mínimo de 6 caracteres"
                            minLength="6"
                            required 
                            className="w-full p-3 border border-sky-400 rounded-md text-[15px] outline-none focus:border-sky-600 font-normal mt-1"
                        />
                    </label>
                    
                    <label className="text-slate-800 text-[13px] font-bold mt-1">
                        Perfil de Acesso
                        {/* AQUI ESTÁ A CORREÇÃO CRÍTICA DO BUG DO ENUM */}
                        <select 
                            name="perfil" 
                            value={form.perfil} 
                            onChange={handleChange} 
                            required
                            className="w-full p-3 border border-sky-400 rounded-md text-[15px] outline-none focus:border-sky-600 font-normal bg-white mt-1"
                        >
                            <option value="ATENDENTE">Atendente (Acesso ao Kanban)</option>
                            <option value="ADMIN">Administrador (Acesso Total)</option>
                        </select>
                    </label>

                    {/* Mensagens de Feedback */}
                    {status.message && (
                        <p className={`text-[13px] mt-2 font-semibold text-center ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {status.message}
                        </p>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-md p-3.5 mt-5 text-[15px] font-bold transition-colors cursor-pointer"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar Colaborador'}
                    </button>
                </form>
            </section>
        </main>
    )
}