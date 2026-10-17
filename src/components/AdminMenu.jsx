import { NavLink } from 'react-router-dom';

function AdminMenu({menuAberto, setMenuAberto}) {

    const paginas = [
        { nome: 'Insights', rota: '/Insights', icone: '◉' },
        { nome: 'Agendamentos', rota: '/AgendamentosAdmin', icone: '▦' },
        { nome: 'Clientes', rota: '/ClientesAdmin', icone: '♙' },
        { nome: 'Galeria', rota: '/GaleriaAdmin', icone: '▧' },
        { nome: 'Configurações', rota: '/ConfiguracoesAdmin', icone: '⚙' },
    ];

    return (
        <aside
            className={`admin-menu ${menuAberto ? 'aberto' : 'recolhido'}`}
        >
            <button
                type="button"
                className="admin-menu-toggle"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label={menuAberto ? 'Recolher menu' : 'Expandir menu'}
                aria-expanded={menuAberto}
            >
                {menuAberto ? '✕' : '☰'}
            </button>

            <nav
                className="admin-menu-links"
                aria-label="Menu administrativo"
            >
                {paginas.map((pagina) => (
                    <NavLink
                        key={pagina.rota}
                        to={pagina.rota}
                        className={({ isActive }) =>
                            `admin-menu-link ${isActive ? 'ativo' : ''}`
                        }
                        onClick={() => {
                            if (window.innerWidth <= 768) {
                                setMenuAberto(false);
                            }
                        }}
                        title={pagina.nome}
                    >
                        <span
                            className="admin-menu-icone"
                            aria-hidden="true"
                        >
                            {pagina.icone}
                        </span>

                        <span className="admin-menu-texto">
                            {pagina.nome}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default AdminMenu;