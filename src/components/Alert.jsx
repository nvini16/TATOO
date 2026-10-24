import { useEffect, useState } from 'react';
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
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        setVisivel(true);
        const temporizador = setTimeout(() => {
            setVisivel(false);
            fechar?.();
        }, 5000);

        return () => clearTimeout(temporizador);
    }, [tipo, titulo, mensagem, fechar]);

    const tipoSeguro = icones[tipo] ? tipo : 'info';
    const Icone = icones[tipoSeguro];
    if (!visivel) return null;

    return (
        <div role="status" className={`alert alert-${tipoSeguro}`}>
            <Icone />

            <div className="alert-content">
                <strong>{titulo}</strong>
                <p>{mensagem}</p>
            </div>

                {fechar && (
                    <button type="button" aria-label="Fechar notificação" onClick={() => { setVisivel(false); fechar(); }}>
                        <X />
                    </button>
                )}
                
        </div>
    );
} 

export default Alert