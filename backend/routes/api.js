const express = require('express');
const supabase = require('../lib/supabase');
const upload = require('../middleware/upload');


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

    if (!nome?.trim() || !whatsapp?.trim) {
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
            erro: error.massage,
        });
    }

    res.status(201).json(data);
})

router.post('/agendamentos', upload.array('imagens', 5), async (req, res) => {
    const {
        nome,
        whatsapp,
        trabalho,
        descricao,
        data,
        horario
    } = req.body;

    console.log('Arquivos recebidos:', req.files);

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

    if (!data || !horario) {
        return res.status(400).json({
            erro: 'Data e horário são obrigatórios.'
        });
    }

    const nomeLimpo = nome.trim();
    const whatsappLimpo = whatsapp.trim();

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
        descricao: descricao?.trim() || null,
        data,
        horario,
    })
    .select()
    .single();

if (erroAgendamento) {
    console.error('Erro ao criar agendamento:', erroAgendamento);

    if (erroAgendamento.code === '23505') {
        return res.status(404).json({
            erro: 'Já existe um cliente ativo para essa data.'
        });
    }

    return res.status(500).json({
        erro: 'Não foi possível criar o agendamento.'
    });

}

return res.status(201).json({
    mensagem: 'Agendamento criado com sucesso.',
    agendamento
})

});



module.exports = router;