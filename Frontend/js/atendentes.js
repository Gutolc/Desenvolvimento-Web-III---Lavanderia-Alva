const token = sessionStorage.getItem('alva_admin_token');
if (!token) window.location.href = 'admin.html';

async function carregarAtendentes() {
  try {
    const funcionarios = await API.get('/api/admin/funcionarios', token);
    const tbody = document.getElementById('listaAtendentes');
    tbody.innerHTML = funcionarios.map(f => `
      <tr>
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.email}</td>
        <td>${f.perfil}</td>
        <td>
          ${f.id > 2 ? `<button class="btn btn-secondary" onclick="excluirAtendente(${f.id})">Excluir</button>` : 'Protegido'}
        </td>
      </tr>
    `).join('');
  } catch (error) {
    alert('Erro ao carregar atendentes.');
  }
}

document.getElementById('formAtendente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    nome: document.getElementById('atNome').value,
    email: document.getElementById('atEmail').value,
    senha: document.getElementById('atSenha').value,
    perfil: document.getElementById('atPerfil').value
  };

  try {
    await API.post('/api/admin/funcionarios', payload, token);
    alert('Atendente cadastrado com sucesso!');
    document.getElementById('formAtendente').reset();
    carregarAtendentes();
  } catch (error) {
    alert('Erro ao cadastrar. O e-mail já existe?');
  }
});

async function excluirAtendente(id) {
  if (!confirm('Deseja realmente remover este acesso?')) return;
  try {
    await API.delete(`/api/admin/funcionarios/${id}`, token);
    carregarAtendentes();
  } catch (error) {
    alert('Erro ao excluir atendente.');
  }
}

document.addEventListener('DOMContentLoaded', carregarAtendentes);