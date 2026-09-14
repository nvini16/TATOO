import { Link } from 'react-router-dom';
import logo from '../assets/logo/marsali-tatoo-logo-green.png';
import fotoBraco from '../assets/foto-do-braco-do-login.jpg';

function Login() {
    return (
        <main className="login-page">

                    <Link to="/" className="login-home-link">
                        Voltar para Home
                    </Link>

                <div className="login-content">

                    <div className="login-brand">
                        <img src={logo} alt="Marsali Tatoo" />
                        <h1>MARSALI TATOO</h1>

                        <form className="login-form">

                            <div className="form-field">
                                <label htmlFor="text">Nome</label>

                                <input
                                    id="text"
                                    type="text"
                                    placeholder="Digite Seu Nome"
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
                                    placeholder="Digite Sua Senha"
                                />
                            </div>


                            <button type="submit">
                                Confirmar
                            </button>

                            <Link to="/cadastro" className="login-register-link">
                                Ainda não tem uma conta?
                            </Link>

                        </form>

                    </div>

                </div>

                <div className="login-image">
                    <img src={fotoBraco} alt="Braço tatuado" />
                </div>
        </main>


    )
}

export default Login