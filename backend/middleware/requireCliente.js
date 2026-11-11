const supabase = require('../lib/supabase');

async function requireCliente(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
        return res.status(401).json({
            erro: 'Autenticação necessária.',
        });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            erro: 'Token de autenticação não informado.',
        });
    }

    const {
        data: { user },
        error: erroAuth,
    } = await supabase.auth.getUser(token);

    if (erroAuth || !user) {
        return res.status(401).json({
            erro: 'Sessão inválida ou expirada.',
        });
    }

    const {
        data: cliente,
        error: erroCliente,
    } = await supabase
            .from('clientes')
            .select('id, nome, whatsapp, criado_em')
            .eq('auth_user_id', user.id)
            .maybeSingle();

    if (erroCliente) {
        return res.status(500).json({
            erro: 'Não foi possível consultar o perfil do cliente.',
        });
    }

    if (!cliente) {
        return res.status(404).json({
            erro: 'Perfil de cliente não informado.',
        });
    }

    req.usuario = user;
    req.cliente = cliente;

    return next();
}

module.exports = requireCliente;