import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function KanbanView() {
	const { logout } = useAuth()
	const [buttonHovered, setButtonHovered] = useState(false)

	return (
		<main style={styles.page}>
			<header style={styles.header}>
				<strong style={styles.logo}>ALVA</strong>
				<button
					type="button"
					onClick={logout}
					onMouseEnter={() => setButtonHovered(true)}
					onMouseLeave={() => setButtonHovered(false)}
					style={{ ...styles.button, backgroundColor: buttonHovered ? '#0369A1' : '#0284C7' }}
				>
					Sair
				</button>
			</header>
			<section style={styles.content}>
				<p style={styles.kicker}>PAINEL OPERACIONAL</p>
				<h1 style={styles.title}>Bem-vindo ao Kanban - Rota Protegida</h1>
				<p style={styles.description}>Acompanhe os pedidos e o fluxo de trabalho da lavanderia.</p>
			</section>
		</main>
	)
}

const styles = {
	page: { minHeight: '100vh', backgroundColor: '#EFF6FF', color: '#1E293B' },
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 7%', backgroundColor: '#FFFFFF', borderBottom: '1px solid #38BDF8' },
	logo: { color: '#0284C7', fontSize: '26px', letterSpacing: '4px' },
	button: { border: 0, borderRadius: '6px', padding: '10px 22px', backgroundColor: '#0284C7', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' },
	content: { maxWidth: '960px', margin: '0 auto', padding: '72px 7%' },
	kicker: { color: '#0284C7', fontSize: '12px', fontWeight: 800, letterSpacing: '2px' },
	title: { margin: '14px 0', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 },
	description: { color: '#1E293B', opacity: 0.75 },
}