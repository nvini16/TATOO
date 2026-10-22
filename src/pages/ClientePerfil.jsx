import { useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

function ClientePerfil() {
    const { id } = useParams();
    return (
        <AdminLayout>
            <main className="cliente-perfil-page">
                <h1>Perfil do cliente</h1>

                <p>Identificador: {id}</p>
            </main>
        </AdminLayout>
    );
}

export default ClientePerfil;