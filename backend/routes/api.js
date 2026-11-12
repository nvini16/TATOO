const express = require('express');
const supabase = require('../lib/supabase');
const upload = require('../middleware/upload');
const criarAgendamento = require('../services/criarAgendamento');
const requireAdmin = require('../middleware/requireAdmin');
const normalizarWhatsapp = require('../utils/normalizarWhatsapp');
const requireCliente = require('../middleware/requireCliente');


const router = express.Router();

router.get('/cliente/perfil', requireCliente, (req, res) => {
    return res.status(200).json({
        cliente: req.cliente,
    });
});

router.get('/cliente/agendamentos', requireCliente, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('agendamentos')
            .select(`
                id,
                arte,
                estilo,
                descricao,
                data,
                horario,
                status,
                pagamento_sinal,
                valor_sinal,
                criado_em
                `)
            .eq('cliente_id', req.cliente.id)
            .order('data', { ascending: true })
            .order('horario', { ascending: true });
        
        if (error) {
            console.error('Erro ao consultar agenda do cliente:', error);

            return res.status(500).json({
                erro: 'Não foi possível carregar seus agendamentos.'
            });
        }

        return res.status(200).json({
            agendamentos: data || []
        });
    } catch (error) {
        console.error('Erro inesperado ao consultar agenda:', error);

        return res.status(500).json({
            erro: 'Ocorreu um erro ao carregar sua agenda.'
        });
    }
});

router.get('/cliente/referencias', requireCliente, async (req, res) => {
    try {
        const { data: agendamentos, error: erroAgendamentos } = await supabase
            .from('agendamentos')
            .select('id, arte, estilo, data, horario, status')
            .eq('cliente_id', req.cliente.id);

        if (erroAgendamentos) {
            throw erroAgendamentos;
        }

        if (!agendamentos || agendamentos.length === 0) {
            return res.status(200).json({
                referencias: []
            });
        }

        const idsAgendamentos = agendamentos.map(
            agendamento => agendamento.id
        );

        const { data: imagens, error: erroImagens } = await supabase
            .from('agendamento_imagens')
            .select('id, agendamento_id, caminho, criado_em')
            .in('agendamento_id', idsAgendamentos)
            .order('criado_em', { ascending: false });

        if (erroImagens) {
            throw erroImagens;
        }

        if (!imagens || imagens.length === 0) {
            return res.status(200).json({
                referencias: []
            });
        }

        const referencias = await Promise.all(
            imagens.map(async imagem => {
                const { data, error } = await supabase.storage
                    .from('agendamento-imagens')
                    .createSignedUrl(imagem.caminho, 3600);

                    if (error) {
                        throw error;
                    }

                    const agendamento = agendamentos.find(
                        item => item.id === imagem.agendamento_id
                    );

                    return {
                        id: imagem.id,
                        agendamento_id: imagem.agendamento_id,
                        criado_em: imagem.criado_em,
                        url: data.signedUrl,
                        arte: agendamento?.arte ?? null,
                        estilo: agendamento?.estilo ?? null,
                        status: agendamento?.status ?? null,
                        data: agendamento?.data ?? null,
                        horario: agendamento?.horario ?? null,
                        estilo: agendamento?.estilo ?? null,
                        data: agendamento?.data ?? null,
                        horario: agendamento?.horario ?? null,
                        status: agendamento?.status ?? null
                    };
            })
        );

        return res.status(200).json({
            referencias
        });
    } catch (error) {
        console.error(
            'Erro ao consultar referências do cliente:', error
        );

        return res.status(500).json({
            erro: 'Não foi possível carregar suas referências.'
        });
    }
});

function textoValido(valor, tamanhoMaximo) {
    return (
        typeof valor === 'string' &&
        valor.trim().length > 0 &&
        valor.trim().length <= tamanhoMaximo
    );
}

function dataValida(data) {
    if (typeof data !== 'string') return false;

    const formato = /^\d{4}-\d{2}-\d{2}$/;

    if (!formato.test(data)) return false;

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataConvertida = new Date(Date.UTC(ano, mes -1, dia));

    return (
        dataConvertida.getUTCFullYear() === ano &&
        dataConvertida.getUTCMonth() === mes -1 &&
        dataConvertida.getUTCDate() === dia
    );
}

const HORARIOS_PERMITIDOS = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
];

function horarioValido(horario) {
    return (
        typeof horario === 'string' &&

    HORARIOS_PERMITIDOS.includes(horario)
    );
}

function dataHoraAtualSP() {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(new Date());

    const valores = {};

    for (const parte of partes) {
        valores[parte.type] = parte.value;
    }

    return {
        data: `${valores.year}-${valores.month}-${valores.day}`,
        horario: `${valores.hour}:${valores.minute}`
    };
}

function agendamentoNoFuturo(data, horario) {
    const atual = dataHoraAtualSP();

    if (data < atual.data) {
        return false;
    }

    if (data === atual.data && horario <= atual.horario) {
        return false;
    }

    return true;
}

router.get('/admin/verify', requireAdmin, (req, res) => {
    res.status(200).json({
        autorizado: true,
    });
});

router.get('/', requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('clientes')
        .select('*');

    if (error) {
        console.error(error);
        return res.status(500).json({
            erro: error.message,
        });
    }

        res.json(data);
    });

router.post('/clientes', requireAdmin, async (req, res) => {
    const { nome, whatsapp } = req.body;

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof whatsapp !== 'string' || !whatsapp.trim()
    ) {
        return res.status(400).json({
            erro: 'Nome e WhatsApp são obrigatórios.',
        });
    }

    const nomeLimpo = nome.trim();

    let whatsappLimpo;

    try {
        whatsappLimpo = normalizarWhatsapp(whatsapp);
    } catch (error) {
        return res.status(400).json({
            erro: error.message
        });
    }

    const { data, error } = await supabase
        .from('clientes')
        .insert({
            nome: nomeLimpo,
            whatsapp: whatsappLimpo,
        })

        .select()
        .single();

    if (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(409).json({
                erro: 'Este cliente já está cadastrado.'
            });
        }

        return res.status(500).json({
            erro: error.message,
        });
    }

    res.status(201).json(data);
})

router.get('/agendamentos/datas-ocupadas', async (req, res) => {
    const statusAtivos = [
        'aguardando_sinal',
        'sinal_pago',
        'aguardando_confirmacao',
        'confirmado'
    ];

    const { data, error } = await supabase
        .from('agendamentos')
        .select('data')
        .in('status', statusAtivos);

    if (error) {
        console.error('Erro ao consultar datas ocupadas:', error);

        return res.status(500).json({
            erro: 'Não foi possível consultar a disponibilidade do calendário.'
        });
    }

    const datas = [...new Set(
        (data || [])
            .map((agendamento) => agendamento.data)
            .filter((data) => typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data))
    )];

    return res.status(200).json({ datas });
});

router.get('/agendamentos', requireAdmin, async (req, res) => { 
    const { data, error } = await supabase
    .from('agendamentos')
    .select('*, clientes(nome, whatsapp)')
    .order('data', { ascending: true });

    if (error) {
        console.error('Erro ao consultar agendamentos:', error);

        return res.status(500).json({
            erro: 'Não foi possível consultar os agendamentos.',
        })
    }

    res.json(data);
});

router.get('/clientes/:id/referencias', requireAdmin, async (req, res) => {
    const {id} = req.params;
    const uuidValido = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidValido.test(id)) {
        return res.status(400).json({
            erro: 'Identificador do cliente inválido.'
        });
    }

    try {
        const { data: agendamentos, error: erroAgendamentos } = await supabase 
            .from('agendamentos')
            .select('id, arte, estilo, status, data, horario')
            .eq('cliente_id', id);
        
        if (erroAgendamentos) {
            throw erroAgendamentos;
        }

        if (!agendamentos.length) {
            return res.json([]);
        }

        const idsAgendamentos = agendamentos.map(
            (agendamento) => agendamento.id
        );

        const {data: imagens, error: erroImagens} = await supabase
            .from('agendamento_imagens')
            .select('id, agendamento_id, caminho, criado_em')
            .in('agendamento_id', idsAgendamentos);

            if (erroImagens) {
                throw erroImagens;
            }

            const imagensComUrl = await Promise.all(
                imagens.map(async (imagem) => {
                    const {data, error} = await supabase.storage
                        .from('agendamento-imagens')
                        .createSignedUrl(imagem.caminho, 3600);

                    if (error) {
                        throw error;
                    }

                    const agendamento = agendamentos.find(
                        (item) => item.id === imagem.agendamento_id
                    );

                    return {
                        id: imagem.id,
                        agendamento_id: imagem.agendamento_id,
                        caminho: imagem.caminho,
                        criado_em: imagem.criado_em,
                        url: data.signedUrl,
                        arte: agendamento?.arte ?? null
                    };
                })
            );

            return res.json(imagensComUrl);
    } catch (error) {
        console.error(
            'Erro ao consultar referências do cliente:', error
        );

        return res.status(500).json({
            erro: 'Não foi possível carregar as imagens de referência.'
        });
    }
});


router.patch('/agendamentos/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'ID do agendamento inválido.'
        });
    }

    const {
        nome,
        whatsapp,
        arte,
        estilo,
        descricao,
        data,
        horario,
        status,
        pagamento_sinal,
        valor_sinal
    } = req.body;

    const statusPermitidos = [
        'aguardando_sinal',
        'sinal_pago',
        'aguardando_confirmacao',
        'confirmado',
        'concluido',
        'cancelado',
        'faltou'
    ];

    const valorInvalido =
        valor_sinal !== null &&
        valor_sinal !== undefined &&
        (
            valor_sinal === '' ||
            !Number.isFinite(Number(valor_sinal)) ||
            Number(valor_sinal) < 0
        );

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof arte !== 'string' || !arte.trim() ||
        typeof estilo !== 'string' || !estilo.trim() ||
        typeof data !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
        typeof horario !== 'string' ||
        !/^\d{2}:\d{2}(:\d{2})?$/.test(horario) ||
        !statusPermitidos.includes(status) ||
        typeof pagamento_sinal !== 'boolean' ||
        valorInvalido
    ) {
        return res.status(400).json({
            erro: 'Dados inválidos. Confira os campos e tente novamente.'
        });
    }

    let whatsappLimpo;

    try {
        whatsappLimpo = normalizarWhatsapp(whatsapp);
    } catch (error) {
        return res.status(400).json({
            erro: error.message
        });
    }

    try {
        const { data: atualizado, error } = await supabase.rpc(
            'editar_agendamento_admin',
            {
                p_id: id,
                p_nome: nome.trim(),
                p_whatsapp: whatsappLimpo,
                p_arte: arte.trim(),
                p_estilo: estilo.trim(),
                p_descricao: descricao ?? null,
                p_data: data,
                p_horario: horario,
                p_status: status,
                p_pagamento_sinal: pagamento_sinal,
                p_valor_sinal:
                    valor_sinal === '' || valor_sinal == null
                        ? null
                        : Number(valor_sinal)
            }
        );

        if (error) {
            console.error('Erro ao editar agendamento:', error);

            if (error.code === '23505') {
                return res.status(409).json({
                    erro: 'Já existe outro agendamento ativo para essa data.'
                });
            }

            if (error.message?.includes('Agendamento não encontrado')) {
                return res.status(404).json({
                    erro: 'Agendamento não encontrado.'
                });
            }

            if (
                error.message?.includes('Dados inválidos') ||
                error.message?.includes('ID do agendamento inválido')
            ) {
                return res.status(400).json({
                    erro: error.message
                });
            }

            return res.status(500).json({
                erro: 'Não foi possível atualizar o agendamento.'
            });
        }

        const { data: completo, error: erroConsulta } = await supabase
            .from('agendamentos')
            .select('*, clientes(nome, whatsapp)')
            .eq('id', id)
            .single();

        if (erroConsulta) {
            console.error(
                'Agendamento atualizado, mas não foi possível recarregar os dados:',
                erroConsulta
            );

            return res.status(200).json({
                mensagem: 'Agendamento atualizado, mas não foi possível recarregar todos os dados.',
                agendamento: atualizado
            });
        }

        return res.status(200).json({
            mensagem: 'Agendamento atualizado com sucesso.',
            agendamento: completo
        });
    } catch (error) {
        console.error('Erro inesperado ao editar agendamento:', error);

        return res.status(500).json({
            erro: 'Ocorreu um erro inesperado ao editar o agendamento.'
        });
    }
});




router.post('/agendamentos', upload.array('imagens', 5), upload.validarConteudo, async (req, res) => {
    const {
        nome,
        whatsapp,
        trabalho,
        estilo,
        descricao,
        data,
        horario
    } = req.body;


    if (!textoValido(nome, 50)) {
        return res.status(400).json({
            erro: 'O nome é obrigatório e deve ter até 50 caracteres.'
        });
    }

    if (typeof whatsapp !== 'string' || !whatsapp.trim()) {
        return res.status(400).json({
            erro: 'O WhatsApp é obrigatório.'
        });
    }

    if (!textoValido(trabalho, 1000)) {
        return res.status(400).json({
            erro: 'O trabalho é obrigatório e deve ter até 1.000 caracteres.'
        });
    }

    if (!textoValido(estilo, 50)) {
        return res.status(400).json({
            erro: 'O estilo é obrigatório e deve ter até 50 caracteres.'
        });
    }

    if (
        descricao !== undefined &&
        descricao !== null &&
        typeof descricao !== 'string'
    ) {
        return res.status(400).json({
            erro: 'A descrição deve ser um texto válido.'
        });
    }

    if (typeof descricao === 'string' &&
        descricao.trim().length > 1000) {
            return res.status(400).json({
                erro: 'A descrição deve ter até 1.000 caracteres.'
            });
        }

        const descricaoLimpa = typeof descricao === 'string' && descricao.trim()
            ? descricao.trim() : null;


    if (!dataValida(data)) {
        return res.status(400).json({
            erro: 'A data informada é inválida.'
        });
    }

    if (!horarioValido(horario)) {
        return res.status(400).json({
            erro: 'O horário informado não é permitido.'
        });
    }

    if (!agendamentoNoFuturo(data, horario)) {
        return res.status(400).json({
            erro: 'O agendamento deve ser realizado para uma data e horário futuros.'
        });
    }

    const nomeLimpo = nome.trim();

    let whatsappLimpo;

    try {
        whatsappLimpo = normalizarWhatsapp(whatsapp);
    } catch (error) {
        return res.status(400).json({
            erro: error.message
        });
    }

    const { data: agendamentoExistente, error: erroDisponibilidade } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('data', data)
        .in('status', [
            'aguardando_sinal',
            'sinal_pago',
            'aguardando_confirmacao',
            'confirmado'
        ])
        .maybeSingle();

    if (erroDisponibilidade) {
        console.error('Erro ao verificar a disponibilidade da data:', erroDisponibilidade);

        return res.status(500).json({
            erro: 'Não foi possível verificar a disponibilidade da data.'
        });
    }

    if (agendamentoExistente) {
        return res.status(409).json({
            erro: 'Já existe um agendamento ativo para essa data.'
        });
    }

    let clienteId = null;

    const authorization = req.headers.authorization;

    if (authorization) {
        if (!authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                erro: 'Formato de autenticação inválido.'
            });
        }

        const token = authorization.slice(7).trim();

        const {
            data: { user },
            error: erroAuth
        } = await supabase.auth.getUser(token);

        if (erroAuth || !user) {
            return res.status(401).json({
                erro: 'Sessão inválida ou expirada.'
            });
        }

        const {
            data: cliente,
            error: erroCliente
        } = await supabase
            .from('clientes')
            .select('id')
            .eq('auth_user_id', user.id)
            .maybeSingle();

        if (erroCliente) {
            return res.status(500).json({
                erro: 'Não foi possível indentificar seu perfil.'
            });
        }

        if (!cliente) {
            return res.status(404).json({
                erro: 'Perfil de cliente mão encontrado.'
            });
        }

        clienteId = cliente.id;
    }

    try {
        const agendamento = await criarAgendamento({
            nome: nomeLimpo,
            whatsapp: whatsappLimpo,
            trabalho: trabalho.trim(),
            estilo: estilo.trim(),
            descricao: descricaoLimpa,
            data,
            horario,
            arquivos: req.files || [],
            clienteId
        });

        return res.status(201).json({
            mensagem: 'Agendamento criado com sucesso.',
            agendamento
        });

    } catch (error) {
        console.error(
            error.contexto || 'Erro inesperado ao criar agendamento:',
            error.originalError || error
        );

        return res.status(error.statusCode || 500).json({
            erro: error.statusCode
                ? error.message
                : 'Ocorreu um erro interno ao criar o agendamento.'
        });
    }
});



module.exports = router;