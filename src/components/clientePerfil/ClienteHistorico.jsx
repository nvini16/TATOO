function ClienteHistorico({ agendamentos }) {
    return (
        <section className="cliente-historico">
            <h2>Histórico de agendamentos</h2>

            <p>
                Total de registros: 
                {agendamentos.length}
            </p>
        </section>
    );
}

export default ClienteHistorico;