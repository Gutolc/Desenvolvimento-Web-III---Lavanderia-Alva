import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const colors = {
	background: '#EFF6FF',
	card: '#FFFFFF',
	primary: '#0284C7',
	hover: '#0369A1',
	text: '#1E293B',
	detail: '#38BDF8',
}

export default function LoginInterno() {
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [erro, setErro] = useState('')
	const [loading, setLoading] = useState(false)
	const [buttonHovered, setButtonHovered] = useState(false)
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
		<main style={{ ...styles.page, backgroundColor: colors.background }}>
			<section style={{ ...styles.card, backgroundColor: colors.card }}>
				<div style={{ ...styles.logo, color: colors.primary }} aria-label="Alva">
					ALVA
				</div>
				<p style={{ ...styles.eyebrow, color: colors.detail }}>GESTÃO DE LAVANDERIA</p>
				<h1 style={{ ...styles.title, color: colors.text }}>Acesse sua conta</h1>
				<p style={{ ...styles.subtitle, color: colors.text }}>Entre para acompanhar a operação da Alva.</p>

				<form onSubmit={handleSubmit} style={styles.form}>
					<label htmlFor="email" style={{ ...styles.label, color: colors.text }}>E-mail</label>
					<input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="seu@email.com"
						autoComplete="email"
						required
						style={{ ...styles.input, borderColor: colors.detail, color: colors.card }}
					/>
					<label htmlFor="senha" style={{ ...styles.label, color: colors.text }}>Senha</label>
					<input
						id="senha"
						name="senha"
						type="password"
						value={senha}
						onChange={(event) => setSenha(event.target.value)}
						placeholder="Digite sua senha"
						autoComplete="current-password"
						required
						style={{ ...styles.input, borderColor: colors.detail, color: colors.card }}
					/>
					{erro && <p role="alert" style={styles.error}>{erro}</p>}
					<button
						type="submit"
						disabled={loading}
						onMouseEnter={() => setButtonHovered(true)}
						onMouseLeave={() => setButtonHovered(false)}
						style={{ ...styles.button, backgroundColor: loading ? colors.detail : buttonHovered ? colors.hover : colors.primary }}
					>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</form>
			</section>
		</main>
	)
}

const styles = {
	page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', boxSizing: 'border-box' },
	card: { width: '100%', maxWidth: '420px', padding: '48px 40px', boxSizing: 'border-box', borderRadius: '12px', boxShadow: '0 18px 45px rgba(30, 41, 59, 0.12)' },
	logo: { fontSize: '34px', fontWeight: 800, letterSpacing: '6px', lineHeight: 1, textAlign: 'center' },
	eyebrow: { margin: '12px 0 30px', fontSize: '11px', fontWeight: 700, letterSpacing: '1.8px', textAlign: 'center' },
	title: { margin: 0, fontSize: '28px', lineHeight: 1.2, textAlign: 'center' },
	subtitle: { margin: '10px 0 30px', fontSize: '14px', lineHeight: 1.5, textAlign: 'center', opacity: 0.75 },
	form: { display: 'flex', flexDirection: 'column', gap: '9px' },
	label: { fontSize: '13px', fontWeight: 700, marginTop: '8px' },
	input: { width: '100%', padding: '13px 14px', boxSizing: 'border-box', border: '1px solid', borderRadius: '6px', fontSize: '15px', outline: 'none' },
	button: { border: 0, borderRadius: '6px', color: '#FFFFFF', padding: '14px', marginTop: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
	error: { margin: '10px 0 0', color: '#B91C1C', fontSize: '13px', lineHeight: 1.4 },
}