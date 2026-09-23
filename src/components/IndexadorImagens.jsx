import { useState } from 'react';

function IndexardorImagens() {
    const [imagens, setImagens] = useState([])
    const handleSelecionatImagens = (event) => {
        const arquivos = Array.from(event.target.files)

        setImagens((imagensAtuais) => [
            ...imagensAtuais,
            ...arquivos,
        ])
    };

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDafault()

        const arquivos = Array.from(event.dataTransfer.files)
            .filter((arquivo) => arquivo.type.statsWith('image/'))
        
            setImagens((imagensAtuais) => [
                ...imagensAtuais,
                ...arquivos,
            ])
    };

    const handleRemoverImagem = (indexParaRemover) => {
        SetImagens((imagensAtuais) => 
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
                {imagens.map((imagem, index) => (
                    <article className="indexador-imagem-card" key={`${imagem.name}-${index}`}>
                        <butoon
                            type="button"
                            className="indexador-imagem-remover"
                            onClick={() => handleRemoverImagem(index)}
                        >
                            X
                        </butoon>

                        <img
                            src={URL.createObjectURL(imagem)}
                            alt={imagem.name}
                        />

                        <p>{imagem.name}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default IndexardorImagens