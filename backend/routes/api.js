const express = require('express');
const supabase = require('../lib/supabase');
const upload = require('../middleware/upload');
const crypto = require('crypto');


const router = express.Router();

router.get('/', async (req, res) => {
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

router.post('/clientes', async (req, res) => {
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

router.post('/agendamentos', upload.array('imagens', 5), async (req, res) => {
    const {
        nome,
        whatsapp,
        trabalho,
        estilo,
        local_corpo,
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

    if (!local_corpo?.trim()) {
        return res.status(400).json({
            erro: 'O local do corpo é obrigatório.'
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
console.log('BODY RECEBIDO:', req.body);
console.log('LOCAL_CORPO RECEBIDO:', local_corpo);
    .from('agendamentos')
    .insert({
        cliente_id: cliente.id,
        arte: trabalho.trim(),
        estilo: estilo.trim(),
        local_corpo: local_corpo.trim(),
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