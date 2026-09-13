import { Link } from 'react-router-dom';
import logo from '../assets/logo/marsali-tatoo-logo-fundo-none.png';
function Login() {
    return (
        <main className="login-page">

            <section className="login-left">
                <div className="login-content">
                    <Link to="/">
                        Voltar para Home
                    </Link>

                    <div className="login-brand">
                        <img src={logo} alt="Marsali Tatoo" />

                        <form className="login-form">

                            <div classname="form-field">
                                <label htmlFor="text">Nome</label>

                                <input
                                    id="text"
                                    type="text"
                                    placeholder="Digite Seu Nome"
                                />
                            </div>

                            <div className="Form-field">
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

                        </form>

                        <h1>MARSALI TATOO</h1>
                    </div>

                </div>
            </section>

            <section className="login-right">
                <div className="login-image">
                    {/* A imagem do braço sera colocada aqui truta */}
                </div>
            </section>
        </main>


    )
}

export default Login