function ClienteHistorico({ agendamentos = [] }) {
    const historicoOrdenado = [...agendamentos].sort((a, b) => {
        const dataA = `${a.data || ''}T${a.horario || '00:00:00'}`;
        const dataB = `${b.data || ''}T${b.horario || '00:00:00'}`;

        return dataB.localeCompare(dataA);
    });

    function formatarData(data) {
        if (!data) return 'Não informada';

        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <section className="cliente-historico">
            <h2>Histórico de agendamentos</h2>

            {historicoOrdenado.length === 0 ? (
                <p>Este cliente ainda não possuí agendamentos.</p>
            ) : (
                <div className="cliente-historico-lista">
                    {historicoOrdenado.map((agendamento) => (
                        <article 
                            className="cliente-historico-item"
                            key={agendamento.id}
                        >
                            <h3>Agendamento #{agendamento.id}</h3>

                            <p>
                                <strong>Data:</strong>{''}

                                {formatarData(agendamento.data)}
                            </p>

                            <p>
                                <strong>Horário:</strong>{''}
                                {agendamento.horario?.slice(0, 5) || 'Não informado'}
                            </p>

                            <p>
                                <strong>Arte:</strong>{''}
                                {agendamento.arte || 'Não informada'}
                            </p>

                            <p>
                                <strong>Descrição:</strong>{''}
                                {agendamento.descricao || 'Não informada'}
                            </p>

                             <p>
                                <strong>Estilo:</strong>{''}
                                {agendamento.estilo || 'Não informada'}
                            </p>

                             <p>
                                <strong>Status:</strong>{''}
                                {agendamento.status || 'Não informada'}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default ClienteHistorico; 