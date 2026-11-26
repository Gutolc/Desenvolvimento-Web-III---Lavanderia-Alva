// Configuração das colunas da esteira de operação da lavanderia.
// Qualquer coluna nova/renomeada/reordenada deve ser feita APENAS aqui,
// o KanbanView é 100% dirigido por este array.
export const KANBAN_COLUMNS = [
  {
    id: "PENDENTE",
    title: "Pendente",
    description: "Pedido recebido, aguardando triagem.",
    accent: "bg-slate-100 border-slate-300 text-slate-700",
    headerAccent: "bg-slate-200 text-slate-800",
  },
  {
    id: "TRIAGEM",
    title: "Triagem",
    description: "Em separação e verificação das peças.",
    accent: "bg-amber-50 border-amber-300 text-amber-700",
    headerAccent: "bg-amber-100 text-amber-800",
  },
  {
    id: "LAVANDO",
    title: "Lavando",
    description: "Peças em processo de lavagem/secagem.",
    accent: "bg-sky-50 border-sky-300 text-sky-700",
    headerAccent: "bg-sky-100 text-sky-800",
  },
  {
    id: "PRONTO",
    title: "Pronto",
    description: "Pedido finalizado, pronto para retirada/entrega.",
    accent: "bg-emerald-50 border-emerald-300 text-emerald-700",
    headerAccent: "bg-emerald-100 text-emerald-800",
  },
]

export const getColumnById = (id) => KANBAN_COLUMNS.find((col) => col.id === id)

export const getNextColumnId = (currentId) => {
  const index = KANBAN_COLUMNS.findIndex((col) => col.id === currentId)
  if (index === -1 || index === KANBAN_COLUMNS.length - 1) return currentId
  return KANBAN_COLUMNS[index + 1].id
}

export const getPreviousColumnId = (currentId) => {
  const index = KANBAN_COLUMNS.findIndex((col) => col.id === currentId)
  if (index <= 0) return currentId
  return KANBAN_COLUMNS[index - 1].id
}
