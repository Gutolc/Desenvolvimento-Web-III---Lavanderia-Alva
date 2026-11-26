import { useState } from 'react'

const ITEMS = [
    { id: 1, nome: 'Camiseta Básica', quantidade: 1, preco: 79.9 },
    { id: 2, nome: 'Calça Jeans Skinny', quantidade: 2, preco: 79.9 },
    { id: 3, nome: 'Boné Azul', quantidade: 1, preco: 49.9 },
]

const OPCOES_RECEBIMENTO = [
    { valor: 'entrega', titulo: 'Entrega', descricao: 'Receba no seu endereço' },
    { valor: 'balcao', titulo: 'Retirada no Balcão', descricao: 'Retire na loja física' },
]

const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CheckoutReview({ onConfirmar }) {
    const [entrega, setEntrega] = useState('entrega')

    const subtotal = ITEMS.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

    // Escolha de frete ou retirada 
    const frete = entrega === 'balcao' ? 0 : null
    const total = subtotal + (frete ?? 0)

    return (
  <main className="fixed inset-0 overflow-auto bg-blue-50 p-8 box-border font-sans text-left text-slate-800">
  <div className="max-w-[1000px] mx-auto">
  <h2 className="text-sky-600 text-2xl font-bold mb-5">Revisão do Pedido</h2>

  <div className="flex flex-col md:flex-row gap-5">
                    
  {/* Coluna esquerda */}
  <div className="flex-[2] flex flex-col gap-5">

  {/* Itens */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-sky-600 text-lg font-bold mb-4">Itens Selecionados</h3>
                            <ul className="list-none p-0 m-0">
                                {ITEMS.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between items-center py-3 border-b border-dashed border-slate-200 last:border-none"
                                    >
                                        <div>
                                            <p className="font-medium m-0">{item.nome}</p>
                                            <p className="text-xs text-slate-500 m-0">
                                                Qtd: {item.quantidade}
                                                {item.quantidade > 1 && ` × ${formatarMoeda(item.preco)}`}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-slate-700 m-0">
                                            {formatarMoeda(item.preco * item.quantidade)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Opções de recebimento */}
                        <fieldset className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm m-0 min-w-0">
                            <legend className="sr-only">Opção de Recebimento</legend>
                            <h3 className="text-sky-600 text-lg font-bold mb-4" aria-hidden="true">
                                Opção de Recebimento
                            </h3>

                            <div className="flex flex-col gap-3">
                                {OPCOES_RECEBIMENTO.map((opcao) => (
                                    <label
                                        key={opcao.valor}
                                        className={`flex items-center gap-3 border-2 rounded-lg p-3.5 cursor-pointer transition-colors ${
                                            entrega === opcao.valor
                                                ? 'border-sky-500 bg-sky-50'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="entrega"
                                            checked={entrega === opcao.valor}
                                            onChange={() => setEntrega(opcao.valor)}
                                            className="accent-sky-600"
                                        />
                                        <div>
                                            <strong className="block text-slate-800 text-sm">
                                                {opcao.titulo}
                                            </strong>
                                            <p className="text-xs text-slate-500 m-0">{opcao.descricao}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    {/* Coluna direita (resumo) */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
                        <h3 className="text-sky-600 text-lg font-bold mb-4">Resumo</h3>

                        <div className="flex justify-between mb-2.5 text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span>{formatarMoeda(subtotal)}</span>
                        </div>

                        <div className="flex justify-between mb-2.5 text-sm text-slate-600">
                            <span>Frete</span>
                            {frete === null ? (
                                <span>A calcular</span>
                            ) : frete === 0 ? (
                                <span className="text-emerald-600 font-medium">Grátis</span>
                            ) : (
                                <span>{formatarMoeda(frete)}</span>
                            )}
                        </div>

                        <hr className="border-slate-200 my-3" />

                        <div className="flex justify-between items-center mb-5 font-bold text-lg text-sky-600">
                            <span>Total:</span>
                            <span>{formatarMoeda(total)}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => onConfirmar?.({ itens: ITEMS, entrega, subtotal, frete, total })}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-md p-3 text-[15px] font-bold cursor-pointer transition-colors shadow-sm"
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}