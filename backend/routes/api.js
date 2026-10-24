const express = require('express');
const supabase = require('../lib/supabase');
const upload = require('../middleware/upload');
const crypto = require('crypto');
const requireAdmin = require('../middleware/requireAdmin');


const router = express.Router();

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

    if (!nome?.trim() || !whatsapp?.trim()) {
        return res.status(400).json({
            erro: 'Nome e WhatsApp são obrigatórios.',
        });
    }

    const nomeLimpo = nome.trim();
    const whatsappLimpo = whatsapp.trim();

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
            .select('id, arte, data')
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
                        arte: agendamento?.arte ?? null,
                        data: agendamento?.data ?? null
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
        typeof whatsapp !== 'string' || !whatsapp.trim() ||
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

    try {
        const { data: atualizado, error } = await supabase.rpc(
            'editar_agendamento_admin',
            {
                p_id: id,
                p_nome: nome.trim(),
                p_whatsapp: whatsapp.trim(),
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




router.post('/agendamentos', upload.array('imagens', 5), async (req, res) => {
    const {
        nome,
        whatsapp,
        trabalho,
        estilo,
        descricao,
        data,
        horario
    } = req.body;


    if (!nome?.trim() || !whatsapp?.trim()) {
        return res.status(400).json({
            erro: 'Nome e WhatsApp são obrigatórios.'
        });
    }

    if (!trabalho?.trim()) {
        return res.status(400).json({
            erro: 'O trabalho é obrigatório.'
        });
    }

    if (!estilo?.trim()) {
        return res.status(400).json({
            erro: 'O estilo é obrigatório.'
        });
    }

    if (!data || !horario) {
        return res.status(400).json({
            erro: 'Data e horário são obrigatórios.'
        });
    }

    const nomeLimpo = nome.trim();
    const whatsappLimpo = whatsapp.trim();

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

    const { data: clienteExistente, error: erroBusca } = await supabase
        .from('clientes')
        .select('id, nome, whatsapp')
        .eq('nome', nomeLimpo)
        .eq('whatsapp', whatsappLimpo)
        .maybeSingle();

    if (erroBusca) {
        console.error('Erro ao buscar cliente:', erroBusca);

        return res.status(500).json({
            erro: 'Não foi possível verificar o cadastro do cliente.'
        });
    }

    let cliente = clienteExistente;

    if (!cliente) {
        const { data: novoCliente, error: erroCadastro } = await supabase
            .from('clientes')
            .insert({
                nome: nomeLimpo,
                whatsapp: whatsappLimpo
            })
            .select('id, nome, whatsapp')
            .single();

    if (erroCadastro) {
        console.error('Erro ao cadastrar cliente:', erroCadastro);

        return res.status(500).json({
            erro: 'Não foi possível cadastrar o cliente.'
        });
    }

    cliente = novoCliente;
}

const { data: agendamento, error: erroAgendamento } = await supabase
    .from('agendamentos')
    .insert({
        cliente_id: cliente.id,
        arte: trabalho.trim(),
        estilo: estilo.trim(),
        descricao: descricao?.trim() || null,
        data,
        horario,
    })
    .select()
    .single();

if (erroAgendamento) {
    console.error('Erro ao criar agendamento:', erroAgendamento);

    if (erroAgendamento.code === '23505') {
        return res.status(409).json({
            erro: 'Já existe um agendamento ativo para essa data'
        });
    }

    return res.status(500).json({
        erro: 'Não foi possível criar o agendamento.'
    });
    
}

for (const arquivo of req.files || []) {
    const nomeUnico = `${crypto.randomUUID()}-${arquivo.originalname}`;
    
    const caminho = `${agendamento.id}/${nomeUnico}`;

    const { error: erroUpload } = await supabase.storage
        .from('agendamento-imagens')
        .upload(caminho, arquivo.buffer, {
            contentType: arquivo.mimetype,
            upsert: false,
        });
        
        if (erroUpload) {
        console.error('Erro ao enviar imagem:', erroUpload);
        
        return res.status(500).json({
            erro: 'Não foi possível enviar uma das imagens.'
        });
    }

    const { error: erroRegistroImagem } = await supabase
        .from('agendamento_imagens')
        .insert({
            agendamento_id: agendamento.id,
            caminho: caminho
        });

    if (erroRegistroImagem) {
        console.error('Erro ao registrar imagem no banco:', erroRegistroImagem);

        return res.status(500).json({
            erro: 'A imagem foi enviada, mas não foi possível registrar sua referência.'
        }); 
    }
}

return res.status(201).json({ 
    mensagem: 'Agendamento criado com sucesso.',
    agendamento
})


});



module.exports = router;