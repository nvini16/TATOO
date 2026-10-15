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

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    const emailUsuario = user.email?.trim().toLowerCase();

    const emailAutorizado = Boolean(adminEmail && emailUsuario === adminEmail) || Boolean(emailUsuario && adminEmails.includes(emailUsuario));

    if (!emailAutorizado) {
        return res.status(403).json({
            erro: 'Acesso restrito à administradora.'
        });  
    }

    req.admin = user;

    next();
}

module.exports = requireAdmin;