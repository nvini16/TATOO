const supabase = require('../lib/supabase');
const crypto = require('crypto');

function criarErro(statusCode, mensagem, contexto, erroOriginal = null) {
    const erro = new Error(mensagem);

    erro.statusCode = statusCode;
    erro.contexto = contexto;
    erro.originalError = erroOriginal;

    return erro;
}

async function criarAgendamento({
    nome,
    whatsapp,
    trabalho,
    estilo,
    descricao,
    data,
    horario,
    arquivos = []
}) {
    // 1. Buscar cliente existente.
    const { data: clienteExistente, error: erroBusca } = await supabase
        .from('clientes')
        .select('id, nome, whatsapp')
        .eq('nome', nome)
        .eq('whatsapp', whatsapp)
        .maybeSingle();

    if (erroBusca) {
        throw criarErro(
            500,
            'Não foi possível verificar o cadastro do cliente.',
            'Erro ao buscar cliente:',
            erroBusca
        );
    }

    // 2. Cadastrar cliente, caso não exista.
    let cliente = clienteExistente;

    if (!cliente) {
        const { data: novoCliente, error: erroCadastro } = await supabase
            .from('clientes')
            .insert({
                nome,
                whatsapp
            })
            .select('id, nome, whatsapp')
            .single();

        if (erroCadastro) {
            throw criarErro(
                500,
                'Não foi possível cadastrar o cliente.',
                'Erro ao cadastrar cliente:',
                erroCadastro
            );
        }

        cliente = novoCliente;
    }

    // 3. Criar agendamento.
    const { data: agendamento, error: erroAgendamento } = await supabase
        .from('agendamentos')
        .insert({
            cliente_id: cliente.id,
            arte: trabalho,
            estilo,
            descricao,
            data,
            horario
        })
        .select()
        .single();

    if (erroAgendamento) {
        if (erroAgendamento.code === '23505') {
            throw criarErro(
                409,
                'Já existe um agendamento ativo para essa data',
                'Conflito ao criar agendamento:',
                erroAgendamento
            );
        }

        throw criarErro(
            500,
            'Não foi possível criar o agendamento.',
            'Erro ao criar agendamento:',
            erroAgendamento
        );
    }

    // 4. Enviar imagens e registrar suas referências.
    for (const arquivo of arquivos) {
        const nomeUnico = `${crypto.randomUUID()}-${arquivo.originalname}`;
        const caminho = `${agendamento.id}/${nomeUnico}`;

        const { error: erroUpload } = await supabase.storage
            .from('agendamento-imagens')
            .upload(caminho, arquivo.buffer, {
                contentType: arquivo.mimetype,
                upsert: false
            });

        if (erroUpload) {
            throw criarErro(
                500,
                'Não foi possível enviar uma das imagens.',
                'Erro ao enviar imagem:',
                erroUpload
            );
        }

        const { error: erroRegistroImagem } = await supabase
            .from('agendamento_imagens')
            .insert({
                agendamento_id: agendamento.id,
                caminho
            });

        if (erroRegistroImagem) {
            throw criarErro(
                500,
                'A imagem foi enviada, mas não foi possível registrar sua referência.',
                'Erro ao registrar imagem no banco:',
                erroRegistroImagem
            );
        }
    }

    // 5. Retornar agendamento criado.
    return agendamento;
}

module.exports = criarAgendamento;
