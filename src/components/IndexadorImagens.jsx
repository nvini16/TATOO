import { useEffect, useRef, useState } from 'react';

const LIMITE_IMAGENS = 5;
const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const LARGURA_MAXIMA = 1200;

function carregarImagem(url) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();

        imagem.onload = () => resolve(imagem);
        imagem.onerror = () => reject(new Error('Não foi possível ler esta imagem.'));
        imagem.src = url;
    });
}

function canvasParaBlob(canvas, qualidade) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('O navegador não conseguiu otimizar esta imagem.'));
            }
        }, 'image/webp', qualidade);
    });
}

async function otimizarImagem(arquivo) {
    // GIFs animados e SVGs podem perder características ao passar pelo canvas.
    if (arquivo.type === 'image/gif' || arquivo.type === 'image/svg+xml') {
        if (arquivo.size <= TAMANHO_MAXIMO) return arquivo;
        throw new Error('Este formato não pode ser otimizado com segurança no navegador. Envie uma imagem de até 5 MB.');
    }

    let urlTemporaria;

    try {
        urlTemporaria = URL.createObjectURL(arquivo);
        const imagem = await carregarImagem(urlTemporaria);
        const proporcao = Math.min(1, LARGURA_MAXIMA / imagem.naturalWidth);
        const largura = Math.max(1, Math.round(imagem.naturalWidth * proporcao));
        const altura = Math.max(1, Math.round(imagem.naturalHeight * proporcao));
        const canvas = document.createElement('canvas');

        canvas.width = largura;
        canvas.height = altura;

        const contexto = canvas.getContext('2d');
        if (!contexto) throw new Error('O navegador não conseguiu processar esta imagem.');

        contexto.drawImage(imagem, 0, 0, largura, altura);

        let blob = await canvasParaBlob(canvas, 0.85);

        // Alguns navegadores podem ignorar o formato WebP solicitado.
        if (blob.type !== 'image/webp') {
            if (arquivo.size <= TAMANHO_MAXIMO) return arquivo;
            throw new Error('Seu navegador não conseguiu converter a imagem para um formato otimizado. Tente outra imagem.');
        }

        // Se ainda exceder o limite do backend, tenta uma compressão mais forte.
        if (blob.size > TAMANHO_MAXIMO) {
            blob = await canvasParaBlob(canvas, 0.7);
        }
        if (blob.size > TAMANHO_MAXIMO) {
            blob = await canvasParaBlob(canvas, 0.55);
        }

        if (blob.size > TAMANHO_MAXIMO) {
            throw new Error('A imagem continua maior que 5 MB após a otimização.');
        }

        // Evita converter quando o WebP não reduz o tamanho do arquivo.
        if (arquivo.size <= TAMANHO_MAXIMO && blob.size >= arquivo.size) {
            return arquivo;
        }

        const nomeSemExtensao = arquivo.name.replace(/\.[^.]+$/, '') || 'referencia';
        return new File([blob], `${nomeSemExtensao}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
        });
    } catch (erro) {
        if (arquivo.size <= TAMANHO_MAXIMO) {
            // Uma imagem que o navegador não consiga decodificar ainda pode ser enviada
            // no formato original, desde que respeite o limite do backend.
            return arquivo;
        }
        throw erro;
    } finally {
        if (urlTemporaria) URL.revokeObjectURL(urlTemporaria);
    }
}

function formatarTamanho(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function IndexadorImagens({ onImagensChange }) {
    const [imagens, setImagens] = useState([]);
    const [otimizando, setOtimizando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const imagensRef = useRef([]);
    const processamentoRef = useRef(false);

    useEffect(() => {
        onImagensChange(imagens);
    }, [imagens, onImagensChange]);

    useEffect(() => {
        imagensRef.current = imagens;
    }, [imagens]);

    useEffect(() => {
        return () => {
            imagensRef.current.forEach((imagem) => URL.revokeObjectURL(imagem.url));
        };
    }, []);

    const adicionarArquivos = async (arquivosRecebidos) => {
        if (processamentoRef.current) return;

        const arquivosImagem = arquivosRecebidos.filter((arquivo) => arquivo.type.startsWith('image/'));
        const arquivosInvalidos = arquivosRecebidos.length - arquivosImagem.length;
        const vagas = LIMITE_IMAGENS - imagensRef.current.length;
        const arquivos = arquivosImagem.slice(0, Math.max(0, vagas));

        if (arquivosInvalidos > 0) {
            setErro('Alguns arquivos foram ignorados porque não são imagens.');
        } else {
            setErro('');
        }

        if (arquivos.length === 0) {
            if (vagas <= 0 && arquivosImagem.length > 0) {
                setErro(`Você pode enviar no máximo ${LIMITE_IMAGENS} imagens por agendamento.`);
            }
            return;
        }

        if (arquivosImagem.length > vagas) {
            setMensagem(`Foram selecionadas apenas ${arquivos.length} imagem(ns) para respeitar o limite de ${LIMITE_IMAGENS}.`);
        } else {
            setMensagem('');
        }

        processamentoRef.current = true;
        setOtimizando(true);

        const novasImagens = [];
        const falhas = [];

        for (let indice = 0; indice < arquivos.length; indice += 1) {
            const arquivoOriginal = arquivos[indice];
            setMensagem(`Otimizando imagem ${indice + 1} de ${arquivos.length}...`);

            try {
                const arquivo = await otimizarImagem(arquivoOriginal);
                novasImagens.push({
                    arquivo,
                    url: URL.createObjectURL(arquivo),
                    tamanhoOriginal: arquivoOriginal.size,
                    tamanhoFinal: arquivo.size,
                });
            } catch (erroOtimizacao) {
                falhas.push(`${arquivoOriginal.name}: ${erroOtimizacao.message}`);
            }
        }

        const imagensAtualizadas = [...imagensRef.current, ...novasImagens];
        imagensRef.current = imagensAtualizadas;
        setImagens(imagensAtualizadas);
        processamentoRef.current = false;
        setOtimizando(false);

        if (falhas.length > 0) {
            setErro(falhas.join(' '));
        }

        if (novasImagens.length > 0) {
            const bytesAntes = novasImagens.reduce((total, imagem) => total + imagem.tamanhoOriginal, 0);
            const bytesDepois = novasImagens.reduce((total, imagem) => total + imagem.tamanhoFinal, 0);
            const economizados = bytesAntes - bytesDepois;

            setMensagem(economizados > 0
                ? `Pronto: ${novasImagens.length} imagem(ns) processada(s). Economia de ${formatarTamanho(economizados)}.`
                : `${novasImagens.length} imagem(ns) pronta(s) para envio.`);
        } else if (falhas.length === 0) {
            setMensagem('');
        }
    };

    const handleSelecionarImagens = (event) => {
        const arquivos = Array.from(event.target.files || []);
        event.target.value = '';
        void adicionarArquivos(arquivos);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (!otimizando) {
            void adicionarArquivos(Array.from(event.dataTransfer.files || []));
        }
    };

    const handleRemoverImagem = (indexParaRemover) => {
        if (otimizando) return;

        const imagemRemovida = imagensRef.current[indexParaRemover];
        if (imagemRemovida) URL.revokeObjectURL(imagemRemovida.url);

        const imagensAtualizadas = imagensRef.current.filter((_, index) => index !== indexParaRemover);
        imagensRef.current = imagensAtualizadas;
        setImagens(imagensAtualizadas);
        setErro('');
        setMensagem('');
    };

    return (
        <section className="indexador-imagens">
            <h2>Imagens da tattoo</h2>
            <p>Até {LIMITE_IMAGENS} imagens. Elas são otimizadas automaticamente no seu dispositivo antes do envio.</p>

            <div
                className="indexador-imagens-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                aria-busy={otimizando}
            >
                <label htmlFor="selecionar-imagens">
                    {otimizando ? 'Otimizando imagens...' : 'Clique para selecionar ou arraste as imagens'}
                </label>

                <input
                    id="selecionar-imagens"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={otimizando || imagens.length >= LIMITE_IMAGENS}
                    onChange={handleSelecionarImagens}
                />
            </div>

            {otimizando && <p role="status" aria-live="polite">{mensagem}</p>}
            {!otimizando && mensagem && <p role="status" aria-live="polite">{mensagem}</p>}
            {erro && <p role="alert">{erro}</p>}

            <div className="indexador-imagens-lista">
                {imagens.map((preview, index) => (
                    <article
                        className="indexador-imagem-card"
                        key={`${preview.arquivo.name}-${index}`}
                    >
                        <button
                            type="button"
                            className="indexador-imagem-remover"
                            onClick={() => handleRemoverImagem(index)}
                            disabled={otimizando}
                            aria-label={`Remover ${preview.arquivo.name}`}
                        >
                            𝓧
                        </button>

                        <img src={preview.url} alt={preview.arquivo.name} loading="lazy" />
                        <p>{preview.arquivo.name}</p>
                        <small>{formatarTamanho(preview.arquivo.size)}</small>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default IndexadorImagens;
