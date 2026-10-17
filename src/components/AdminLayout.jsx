import { useState } from 'react';
import AdminMenu from './AdminMenu';
import '../styles/adminLayout.css';

function AdminLayout({ children }) {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div
            className={`admin-layout ${
                menuAberto ? 'menu-expandido' : 'menu-recolhido'
            }`}
        >
            <AdminMenu
                menuAberto={menuAberto}
                setMenuAberto={setMenuAberto}
            />

            <div className="admin-layout-content">
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
