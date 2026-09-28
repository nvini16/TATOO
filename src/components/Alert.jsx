import {
    CheckCircle2,
    XCircle,
    TriangleAlert,
    Info,
    X
} from 'lucide-react';

const icones = {
    sucesso: CheckCircle2,
    erro: XCircle,
    aviso: TriangleAlert,
    info: Info
}

function Alert({ tipo, titulo, mensagem, fechar }) {
    const tipoSeguro = icones[tipo] ? tipo : 'info';
    const Icone = icones[tipoSeguro];
    return (
        <div className={`alert alert-${tipoSeguro}`}>
            <Icone />

            <div className="alert-content">
                <strong>{titulo}</strong>
                <p>{mensagem}</p>
                {fechar && (
                    <button type="button" onClick={fechar}>
                        <X />
                    </button>
                )}
            </div>
        </div>
    );
} 

export default Alert