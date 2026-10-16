import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    CalendarDays,
    ChartNoAxesCombined,
    Images,
    Menu,
    Settings,
    Users,
    X,
} from 'lucide-react';
import './AdminLayout.css';

const itensMenu = [
    {
        label: 'Insights',
        destino: '/Insights',
        Icone: ChartNoAxesCombined,
        disponivel: true,
    },
    {
        label: 'Agendamentos',
        Icone: CalendarDays,
        disponivel: false,
    },
    {
        label: 'Clientes',
        Icone: Users,
        disponivel: false,
    },
    {
        label: 'Galeria',
        Icone: Images,
        disponivel: false,
    },
    {
        label: 'Configurações',
        Icone: Settings,
        disponivel: false,
    },
];

function AdminLayout({ children }) {
    const [menuAberto, setMenuAberto] = useState(false);

    function fecharMenu() {
        setMenuAberto(false);
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar" aria-label="Menu administrativo">
                <div className="admin-sidebar-brand">
                    <span className="admin-brand-mark" aria-hidden="true">
                        M
                    </span>
                    <div>
                        <strong>MARSALI</strong>
                        <span>PAINEL ADMINISTRATIVO</span>
                    </div>
                </div>

                <nav className="admin-nav" aria-label="Páginas administrativas">
                    {itensMenu.map(({ label, destino, Icone, disponivel }) => {
                        if (disponivel) {
                            return (
                                <NavLink
                                    key={label}
                                    to={destino}
                                    end
                                    className={({ isActive }) =>
                                        `admin-nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <Icone size={20} aria-hidden="true" />
                                    <span>{label}</span>
                                </NavLink>
                            );
                        }

                        return (
                            <button
                                key={label}
                                type="button"
                                className="admin-nav-item admin-nav-item-disabled"
                                disabled
                                title="Página ainda não implementada"
                            >
                                <Icone size={20} aria-hidden="true" />
                                <span>{label}</span>
                                <span className="admin-nav-soon">Em breve</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <div className="admin-mobile-menu">
                {menuAberto && (
                    <nav
                        className="admin-mobile-nav"
                        aria-label="Páginas administrativas"
                    >
                        {itensMenu.map(({ label, destino, Icone, disponivel }) => {
                            if (disponivel) {
                                return (
                                    <NavLink
                                        key={label}
                                        to={destino}
                                        end
                                        className={({ isActive }) =>
                                            `admin-mobile-nav-item ${isActive ? 'active' : ''}`
                                        }
                                        aria-label={label}
                                        title={label}
                                        onClick={fecharMenu}
                                    >
                                        <Icone size={21} aria-hidden="true" />
                                    </NavLink>
                                );
                            }

                            return (
                                <button
                                    key={label}
                                    type="button"
                                    className="admin-mobile-nav-item"
                                    disabled
                                    aria-label={`${label}, em breve`}
                                    title={`${label} — em breve`}
                                >
                                    <Icone size={21} aria-hidden="true" />
                                </button>
                            );
                        })}
                    </nav>
                )}

                <button
                    type="button"
                    className="admin-mobile-fab"
                    onClick={() => setMenuAberto((aberto) => !aberto)}
                    aria-label={menuAberto ? 'Fechar menu administrativo' : 'Abrir menu administrativo'}
                    aria-expanded={menuAberto}
                >
                    {menuAberto ? <X size={23} /> : <Menu size={23} />}
                </button>
            </div>

            <div className="admin-layout-content">
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
