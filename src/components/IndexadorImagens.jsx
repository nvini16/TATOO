import { useState } from 'react';

function IndexadorImagens() {
    const [imagens, setImagens] = useState([])

           
    const handleSelecionatImagens = (event) => {
        const arquivos = Array.from(event.target.files)

        setImagens((imagensAtuais) => [
            ...imagensAtuais,
            ...arquivos.map(() => ({
                arquivos,
                url: URL.createObjectURL(arquivos),
            })),
        ])
    };

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()

        const arquivos = Array.from(event.dataTransfer.files)
            .filter((arquivo) => arquivo.type.startsWith('image/'))
        
            setImagens((imagensAtuais) => [
                ...imagensAtuais,
                ...arquivos,
            ])
    };

    const handleRemoverImagem = (indexParaRemover) => {
        setImagens((imagensAtuais) => 
            imagensAtuais.filter((_, index) => index !== indexParaRemover)
    )
}
    return (
        <section className="indexador-imagens">
            <h2>Imagens da tattoo</h2>

            <div 
                className="indexador-imagens-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label htmlFor="selecionar-imagens">
                    Selecionar imagens
                </label>

                <input 
                    id="selecionar-imagens"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSelecionatImagens}
                />

            </div>

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
                        >
                            X
                        </button>

                        <img
                            src={preview.url}
                            alt={preview.arquivo.name}
                        />

                        <p>{preview.arquivo.name}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default IndexadorImagens