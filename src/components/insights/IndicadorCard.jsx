function IndicadorCard({ titulo, valor, descricao }) {
    return (
        <article className="insights-card">
            <h2>{titulo}</h2>

            <p className="insights-card-value">
                {valor}
            </p>

            <span className="insights-card-description">
                {descricao}
            </span>
        </article>
    );
}

export default IndicadorCard;