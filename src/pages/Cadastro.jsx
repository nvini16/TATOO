import { Link } from 'react-router-dom';
import fotoBraco from '../assets/foto-do-braco-do-login.jpg';
import logo from '../assets/logo/marsali-tatoo-logo-green.png';

function Cadastro() {
    return (
        <main className="cadastro-page">
            <div className="cadastro-image">
                <img src={fotoBraco} alt="Braço tatuado" />
            </div>

            <div className="cadastro-content">
                <Link to="/">
                    Voltar a Home
                </Link>

                <div className="cadastro-brand">
                    <img src={logo} alt="Marsali tatoo" />
                    <h1>marsali tatoo</h1>

                </div>

                <form className="cadastro-form">
                    <div className="form-field">
                        <label htmlFor="name">Nome</label>

                    <input 
                        id="name"
                        type="text"
                        placeholder="Digite seu nome"
                    />
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">E-mail</label>

                        <input 
                            id="email"
                            type="email"
                            placeholder="Digite Seu e-mail"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Senha</label>

                        <input 
                            id="password"
                            type="password"
                            placeholder="Digite Sua senha"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmar-senha">Confirmar senha</label>

                        <input 
                            id="confirmar-senha"
                            type="password"
                            placeholder="Confirme Sua Senha"
                        />
                    </div>

                    <button type="submit">
                        Criar conta
                    </button>

                    <Link to="/Login">
                        Já possui uma conta? Entrar
                    </Link>

                </form>
            </div>
        </main>
    );
}

export default Cadastro;