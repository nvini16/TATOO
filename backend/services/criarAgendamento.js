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
    arquivos = [],
    clienteId = null
}, supabaseClient = supabase) {
    
    let cliente;

    // Cliente autenticado: utilizar o perfil indentificado pela sessão. 
    if (clienteId) {
        cliente = { id: clienteId };
    } else {
        // Visitante público: manter o comportamento addUncaughtExceptionCaptureCallback. 
        const { data: clienteExistente, error: erroBusca} = await supabaseClient
            .from('clientes')
            .select('id, nome, whatsapp')
            .eq('nome', nome)
            .eq('whatsapp', whatsapp)
            .is('auth_user_id', null)
            .maybeSingle();

        if (erroBusca) {
            throw criarErro(
                500,
                'Não foi possível verificar o cadastro do cliete.',
                'Erro ao buscar clinete:',
                erroBusca
            );
        }

        cliente = clienteExistente;

        if (!cliente) {
            const { data: novoCliente, error: erroCadastro } = await supabaseClient
                .from('clientes')
                .insert({nome, whatsapp})
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
    }

    // 3. Criar agendamento.
    const { data: agendamento, error: erroAgendamento } = await supabaseClient
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
    const caminhosEnviados = [];

    try {
        for (const arquivo of arquivos) {
            const nomeUnico = `${crypto.randomUUID()}-${arquivo.originalname}`;
            const caminho = `${agendamento.id}/${nomeUnico}`;

            const { error: erroUpload } = await supabaseClient.storage
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

            // Registrar imediatamente para permitir a compensação.
            caminhosEnviados.push(caminho);

            const { error: erroRegistroImagem } = await supabaseClient
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

    } catch (erroOriginal) {
        const falhasCompensacao = [];

        // 6. Remover referências de imagens vinculadas ao novo agendamento.
        try {
            const { error } = await supabaseClient
                .from('agendamento_imagens')
                .delete()
                .eq('agendamento_id', agendamento.id);

            if (error) {
                falhasCompensacao.push({
                    etapa: 'remover referências das imagens',
                    agendamentoId: agendamento.id,
                    erro: error
                });
            }
        } catch (error) {
            falhasCompensacao.push({
                etapa: 'remover referências das imagens',
                agendamentoId: agendamento.id,
                erro: error
            });
        }

        // 7. Remover arquivos enviados ao Storage nesta operação.
        if (caminhosEnviados.length > 0) {
            try {
                const { error } = await supabaseClient.storage
                    .from('agendamento-imagens')
                    .remove(caminhosEnviados);

                if (error) {
                    falhasCompensacao.push({
                        etapa: 'remover arquivos do Storage',
                        agendamentoId: agendamento.id,
                        caminhos: caminhosEnviados,
                        erro: error
                    });
                }
            } catch (error) {
                falhasCompensacao.push({
                    etapa: 'remover arquivos do Storage',
                    agendamentoId: agendamento.id,
                    caminhos: caminhosEnviados,
                    erro: error
                });
            }
        }

        // 8. Excluir somente o agendamento criado nesta operação.
        try {
            const { error } = await supabaseClient
                .from('agendamentos')
                .delete()
                .eq('id', agendamento.id);

            if (error) {
                falhasCompensacao.push({
                    etapa: 'excluir agendamento recém-criado',
                    agendamentoId: agendamento.id,
                    erro: error
                });
            }
        } catch (error) {
            falhasCompensacao.push({
                etapa: 'excluir agendamento recém-criado',
                agendamentoId: agendamento.id,
                erro: error
            });
        }

        if (falhasCompensacao.length > 0) {
            console.error(
                'A compensação do agendamento não foi concluída integralmente:',
                {
                    agendamentoId: agendamento.id,
                    caminhosEnviados,
                    falhas: falhasCompensacao
                }
            );
        }

        if (erroOriginal && typeof erroOriginal === 'object') {
            erroOriginal.falhasCompensacao = falhasCompensacao;
        }

        throw erroOriginal;
    }
}

module.exports = criarAgendamento;
