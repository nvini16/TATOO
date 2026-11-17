import { useEffect, useState } from 'react';

const STATUS_AGENDAMENTOS = [
    { valor: 'aguardando_sinal', titulo: 'Aguardando sinal', cor: '#F2C94C' },
    { valor: 'sinal_pago', titulo: 'Sinal pago', cor: '#3498DB' },
    { valor: 'concluido', titulo: 'Concluído', cor: '#27AE60' },
    { valor: 'cancelado', titulo: 'Cancelado', cor: '#EB5757' },
    { valor: 'faltou', titulo: 'Faltou', cor: '#828282' },
];

function DistribuicaoStatus({ agendamentos, carregando, erro }) {
    const [descricaoAberta, setDescricaoAberta] = useState(null);

    useEffect(() => {
        const fecharAoTocarFora = (event) => {
            if (!event.target.closest('.distribuicao-status-interativo')) {
                setDescricaoAberta(null);
            }
        };

        document.addEventListener('pointerdown', fecharAoTocarFora);

        return () => {
            document.removeEventListener('pointerdown', fecharAoTocarFora);
        };
    }, []);

    if (carregando) {
        return (
            <section className="distribuicao-status" aria-live="polite">
                <h2>Distribuição de status</h2>
                <p className="distribuicao-status-mensagem">
                    Carregando distribuição dos agendamentos...
                </p>
            </section>
        );
    }

    if (erro) {
        return (
            <section className="distribuicao-status" aria-live="polite">
                <h2>Distribuição de status</h2>
                <p className="distribuicao-status-mensagem" role="alert">
                    Não foi possível carregar o gráfico: {erro}
                </p>
            </section>
        );
    }

    if (!Array.isArray(agendamentos)) {
        return null;
    }

    const total = agendamentos.length;

    const dados = STATUS_AGENDAMENTOS.map((status) => {
        const quantidade = agendamentos.filter(
            (agendamento) => agendamento.status === status.valor
        ).length;

        const percentual = total > 0 ? (quantidade / total) * 100 : 0;

        return {
            ...status,
            quantidade,
            percentual,
        };
    });

    return (
        <section
            className="distribuicao-status"
            aria-labelledby="distribuicao-status-titulo"
        >
            <header className="distribuicao-status-header">
                <div>
                    <h2 id="distribuicao-status-titulo">
                        Distribuição de status
                    </h2>
                    <p>Quantidade de agendamentos por status.</p>
                </div>

                <div className="distribuicao-status-total">
                    <span>Total</span>
                    <strong>{total}</strong>
                </div>
            </header>

            <ul className="distribuicao-status-lista">
                {dados.map((status) => {
                    const possuiDescricao = [
                        'aguardando_sinal',
                        'sinal_pago',
                    ].includes(status.valor);

                    const conteudoStatus = (
                        <>
                            <span className="distribuicao-status-info">
                                <span className="distribuicao-status-nome">
                                    <span
                                        className="distribuicao-status-legenda"
                                        style={{ backgroundColor: status.cor }}
                                        aria-hidden="true"
                                    />
                                    {status.titulo}
                                </span>

                                <span className="distribuicao-status-valor">
                                    <strong>{status.quantidade}</strong>
                                    <span>
                                        {status.percentual.toLocaleString('pt-BR', {
                                            maximumFractionDigits: 1,
                                        })}%
                                    </span>
                                </span>
                            </span>

                            <span
                                className="distribuicao-status-trilho"
                                role="progressbar"
                                aria-label={`Percentual de agendamentos: ${status.titulo}`}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-valuenow={Number(status.percentual.toFixed(1))}
                            >
                                <span
                                    className="distribuicao-status-barra"
                                    style={{
                                        width: `${status.percentual}%`,
                                        backgroundColor: status.cor,
                                    }}
                                />
                            </span>
                        </>
                    );

                    return (
                        <li
                            className="distribuicao-status-item"
                            key={status.valor}
                            onPointerEnter={(event) => {
                                if (event.pointerType === 'mouse' && possuiDescricao) {
                                    setDescricaoAberta(status.valor);
                                }
                            }}
                            onPointerLeave={(event) => {
                                if (event.pointerType === 'mouse' && possuiDescricao) {
                                    setDescricaoAberta(null);
                                }
                            }}
                        >
                            {possuiDescricao ? (
                                <button
                                    type="button"
                                    className="distribuicao-status-area-botao distribuicao-status-interativo"
                                    aria-expanded={descricaoAberta === status.valor}
                                    aria-controls={`descricao-${status.valor}`}
                                    onClick={() => setDescricaoAberta((atual) =>
                                        atual === status.valor ? null : status.valor
                                    )}
                                >
                                    {conteudoStatus}
                                </button>
                            ) : (
                                conteudoStatus
                            )}

                            {possuiDescricao && descricaoAberta === status.valor && (
                                <div
                                    className="distribuicao-status-descricao distribuicao-status-interativo"
                                    id={`descricao-${status.valor}`}
                                    role="tooltip"
                                    style={{ borderColor: status.cor }}
                                >
                                    <strong style={{ color: status.cor }}>{status.titulo}</strong>
                                    <p>
                                        {status.valor === 'aguardando_sinal'
                                            ? 'O cliente realizou a solicitação do agendamento, mas ainda não efetuou o pagamento do sinal. O horário permanece aguardando essa etapa para avançar no processo de confirmação.'
                                            : 'O cliente realizou o pagamento do sinal solicitado. O agendamento agora aguarda a confirmação manual do estúdio para que o horário seja oficialmente confirmado.'}
                                    </p>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default DistribuicaoStatus;
