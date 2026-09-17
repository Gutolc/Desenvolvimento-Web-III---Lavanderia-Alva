import { useState } from 'react'
import { cadastrarUsuario } from '../../services/usuarioService'

export default function CadastroFuncionario() {
	const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: '' })
	const [status, setStatus] = useState('')

	const handleChange = ({ target }) => {
		setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setStatus('')

		try {
			await cadastrarUsuario(form.nome, form.email, form.senha, form.perfil)
			setForm({ nome: '', email: '', senha: '', perfil: '' })
			setStatus('Funcionário cadastrado com sucesso.')
		} catch (error) {
			setStatus(error.message)
		}
	}

	return (
		<main>
			<h1>Cadastro de funcionário</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Nome
					<input name="nome" value={form.nome} onChange={handleChange} required />
				</label>
				<label>
					E-mail
					<input type="email" name="email" value={form.email} onChange={handleChange} required />
				</label>
				<label>
					Senha
					<input type="password" name="senha" value={form.senha} onChange={handleChange} required />
				</label>
				<label>
					Perfil
					<input name="perfil" value={form.perfil} onChange={handleChange} required />
				</label>
				<button type="submit">Cadastrar</button>
			</form>
			{status && <p role="status">{status}</p>}
		</main>
	)
}
