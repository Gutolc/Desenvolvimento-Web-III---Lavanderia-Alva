import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginInterno() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        setErro('')
        setLoading(true)

        try {
            await login(email, senha)
            navigate('/kanban')
        } catch (error) {
            setErro(error.response?.data?.message || 'Não foi possível entrar. Verifique suas credenciais.')
        } finally {
            setLoading(false)
        }
    }

    return (
        // O Tailwind cuida do layout e das cores nativamente
        <main className="min-h-screen grid place-items-center bg-blue-50 p-6 box-border">
            <section className="w-full max-w-[420px] p-12 bg-white box-border rounded-xl shadow-[0_18px_45px_rgba(30,41,59,0.12)]">
                
                <div className="text-sky-600 text-[34px] font-extrabold tracking-[6px] leading-none text-center" aria-label="Alva">
                    ALVA
                </div>
                
                <p className="text-sky-400 my-3 text-[11px] font-bold tracking-[1.8px] text-center">
                    GESTÃO DE LAVANDERIA
                </p>
                
                <h1 className="text-slate-800 m-0 text-3xl leading-tight text-center">
                    Acesse sua conta
                </h1>
                
                <p className="text-slate-800 opacity-75 my-3 text-sm leading-relaxed text-center mb-8">
                    Entre para acompanhar a operação da Alva.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-slate-800 text-[13px] font-bold mt-2">
                        E-mail
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                        className="w-full p-[13px_14px] border border-sky-400 rounded-md text-[15px] text-slate-800 outline-none focus:border-sky-600"
                    />

                    <label htmlFor="senha" className="text-slate-800 text-[13px] font-bold mt-2">
                        Senha
                    </label>
                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        required
                        className="w-full p-[13px_14px] border border-sky-400 rounded-md text-[15px] text-slate-800 outline-none focus:border-sky-600"
                    />

                    {erro && <p role="alert" className="text-red-700 text-[13px] m-[10px_0_0] leading-relaxed">{erro}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-md p-3.5 mt-4 text-[15px] font-bold cursor-pointer transition-colors"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </section>
        </main>
    )
}