const supabase = require('../lib/supabase');

async function requireAdmin(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
        return res.status(401).json({
            erro: 'Autenticação necessária.',
        });
    }

    const token = authorization.slice(7);

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({
            erro: 'Sessão inválida ou expirada.',
        });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (
        !adminEmail || user.email?.toLowerCase() !== adminEmail.trim().toLowerCase()
    ) {
        return res.status(403).json({
            erro: 'Acesso restrito à administradora.',
        });
    }

    req.admin = user;

    next();
}

module.exports = requireAdmin;