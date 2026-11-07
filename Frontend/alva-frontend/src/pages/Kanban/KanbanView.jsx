import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { KANBAN_COLUMNS, getNextColumnId, getPreviousColumnId } from './kanbanConfig'
import { listarPedidos, atualizarStatusPedido } from '../../services/pedidoService'

function PedidoCard({ pedido, isFirstColumn, isLastColumn, onMove, isDragging }) {
    return (
        <article
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', String(pedido.id))
                event.dataTransfer.effectAllowed = 'move'
            }}
            className={`bg-white border border-slate-200 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${
                isDragging ? 'opacity-40' : 'opacity-100'
            }`}
        >
            <p className="font-bold text-slate-800 text-sm">{pedido.cliente}</p>
            <p className="text-slate-500 text-xs mt-1">{pedido.servico}</p>
            <div className="flex justify-between items-center mt-3">
                <button
                    type="button"
                    disabled={isFirstColumn}
                    onClick={() => onMove(pedido, 'back')}
                    className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="Mover para coluna anterior"
                >
                    ← Voltar
                </button>
                <button
                    type="button"
                    disabled={isLastColumn}
                    onClick={() => onMove(pedido, 'forward')}
                    className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                    aria-label="Mover para próxima coluna"
                >
                    Avançar →
                </button>
            </div>
        </article>
    )
}

function KanbanColumn({ column, pedidos, onDropPedido, onMovePedido, draggingId }) {
    const [isDragOver, setIsDragOver] = useState(false)
    const columnIndex = KANBAN_COLUMNS.findIndex((col) => col.id === column.id)

    return (
        <section
            onDragOver={(event) => {
                event.preventDefault()
                setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
                event.preventDefault()
                setIsDragOver(false)
                const pedidoId = Number(event.dataTransfer.getData('text/plain'))
                onDropPedido(pedidoId, column.id)
            }}
            className={`flex-1 min-w-[260px] rounded-xl border-2 p-3 flex flex-col gap-3 transition-colors ${column.accent} ${
                isDragOver ? 'border-dashed ring-2 ring-sky-400' : ''
            }`}
        >
            <header className={`rounded-lg px-3 py-2 ${column.headerAccent}`}>
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-sm tracking-wide">{column.title}</h2>
                    <span className="text-xs font-bold bg-white/70 rounded-full px-2 py-0.5">
                        {pedidos.length}
                    </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">{column.description}</p>
            </header>

            <div className="flex flex-col gap-2 min-h-[80px]">
                {pedidos.length === 0 && (
                    <p className="text-xs text-center opacity-50 py-6">Nenhum pedido aqui.</p>
                )}
                {pedidos.map((pedido) => (
                    <PedidoCard
                        key={pedido.id}
                        pedido={pedido}
                        isDragging={draggingId === pedido.id}
                        isFirstColumn={columnIndex === 0}
                        isLastColumn={columnIndex === KANBAN_COLUMNS.length - 1}
                        onMove={onMovePedido}
                    />
                ))}
            </div>
        </section>
    )
}

export default function KanbanView() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')
    const [draggingId, setDraggingId] = useState(null)

    const carregarPedidos = useCallback(async () => {
        setLoading(true)
        setErro('')
        try {
            const dados = await listarPedidos()
            setPedidos(dados)
        } catch (error) {
            setErro('Não foi possível carregar os pedidos.')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        carregarPedidos()
    }, [carregarPedidos])

    const pedidosPorColuna = useMemo(() => {
        const agrupado = Object.fromEntries(KANBAN_COLUMNS.map((col) => [col.id, []]))
        pedidos.forEach((pedido) => {
            if (agrupado[pedido.status]) {
                agrupado[pedido.status].push(pedido)
            } else {
                // Status desconhecido cai em "Pendente" para não perder o pedido de vista.
                agrupado.PENDENTE.push(pedido)
            }
        })
        return agrupado
    }, [pedidos])

    const moverPedido = useCallback(async (pedidoId, novoStatus) => {
        setPedidos((atual) =>
            atual.map((pedido) =>
                pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
            )
        )
        try {
            await atualizarStatusPedido(pedidoId, novoStatus)
        } catch (error) {
            console.error('Erro ao mover pedido, recarregando lista:', error)
            carregarPedidos()
        }
    }, [carregarPedidos])

    const handleDropPedido = useCallback((pedidoId, colunaDestinoId) => {
        setDraggingId(null)
        moverPedido(pedidoId, colunaDestinoId)
    }, [moverPedido])

    const handleMoveButton = useCallback((pedido, direcao) => {
        const novoStatus = direcao === 'forward'
            ? getNextColumnId(pedido.status)
            : getPreviousColumnId(pedido.status)
        if (novoStatus === pedido.status) return
        moverPedido(pedido.id, novoStatus)
    }, [moverPedido])

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

            <section className="max-w-[1400px] mx-auto px-[4%] pt-10 pb-16">
                <p className="text-sky-600 text-xs font-extrabold tracking-[2px]">
                    PAINEL OPERACIONAL
                </p>
                <h1 className="text-sky-600 my-3.5 text-[clamp(26px,4vw,40px)] leading-[1.1]">
                    Esteira de Operação — Kanban
                </h1>
                <p className="text-slate-800 opacity-75 mb-8">
                    Arraste os cards entre as colunas ou use os botões Avançar/Voltar para atualizar o status do pedido.
                </p>

                {loading && <p className="text-slate-500">Carregando pedidos...</p>}
                {erro && <p className="text-red-600 font-semibold">{erro}</p>}

                {!loading && !erro && (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {KANBAN_COLUMNS.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                pedidos={pedidosPorColuna[column.id] || []}
                                draggingId={draggingId}
                                onDropPedido={handleDropPedido}
                                onMovePedido={handleMoveButton}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
