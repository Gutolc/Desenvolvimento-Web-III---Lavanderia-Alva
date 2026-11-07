import api from "./api"
import { KANBAN_COLUMNS } from "../pages/Kanban/kanbanConfig"

const MOCK_STORAGE_KEY = "alva_pedidos_mock"

const seedMock = () => [
  { id: 1, cliente: "Maria Souza", servico: "Lavagem + Secagem", status: "PENDENTE" },
  { id: 2, cliente: "João Pereira", servico: "Lavagem a seco", status: "PENDENTE" },
  { id: 3, cliente: "Ana Lima", servico: "Passadoria", status: "TRIAGEM" },
  { id: 4, cliente: "Carlos Dias", servico: "Lavagem + Secagem", status: "LAVANDO" },
  { id: 5, cliente: "Beatriz Alves", servico: "Edredom", status: "LAVANDO" },
  { id: 6, cliente: "Rafael Nunes", servico: "Lavagem a seco", status: "PRONTO" },
]

function loadMock() {
  const raw = localStorage.getItem(MOCK_STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  const seeded = seedMock()
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

function saveMock(pedidos) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(pedidos))
}

const validStatusIds = new Set(KANBAN_COLUMNS.map((col) => col.id))

export async function listarPedidos() {
  try {
    const response = await api.get("/api/pedidos")
    return response.data
  } catch (error) {
    // Backend ainda não expõe /api/pedidos -> usa dados locais (mock) para não travar a UI.
    console.warn("[pedidoService] usando dados mock (API indisponível):", error.message)
    return loadMock()
  }
}

export async function atualizarStatusPedido(pedidoId, novoStatus) {
  if (!validStatusIds.has(novoStatus)) {
    throw new Error(`Status inválido: ${novoStatus}`)
  }

  try {
    const response = await api.patch(`/api/pedidos/${pedidoId}/status`, { status: novoStatus })
    return response.data
  } catch (error) {
    console.warn("[pedidoService] atualizando status no mock (API indisponível):", error.message)
    const pedidos = loadMock()
    const atualizados = pedidos.map((pedido) =>
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
    )
    saveMock(atualizados)
    return atualizados.find((pedido) => pedido.id === pedidoId)
  }
}
