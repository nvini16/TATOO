const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SUPABASE_URL ||= 'https://example.supabase.co';
process.env.SUPABASE_SECRET_KEY ||= 'test-secret-key';

const criarAgendamento = require('../services/criarAgendamento');

function criarSupabaseSimulado({
    erroUpload = null,
    erroRegistroImagem = null,
    erroExclusaoReferencias = null,
    erroRemocaoStorage = null,
    erroExclusaoAgendamento = null
} = {}) {
    const chamadas = {
        exclusoes: [],
        uploads: [],
        arquivosRemovidos: []
    };

    const cliente = { id: 'cliente-teste', nome: 'Cliente Teste', whatsapp: '13999999999' };
    const agendamento = { id: 'agendamento-teste', cliente_id: cliente.id };

    function criarConsulta(tabela) {
        let operacao = null;
        let dados = null;

        const consulta = {
            select() {
                return this;
            },
            eq() {
                return this;
            },
            maybeSingle() {
                return Promise.resolve({ data: cliente, error: null });
            },
            insert(valor) {
                operacao = 'insert';
                dados = valor;
                return this;
            },
            single() {
                if (tabela === 'clientes') {
                    return Promise.resolve({ data: cliente, error: null });
                }

                if (tabela === 'agendamentos') {
                    return Promise.resolve({ data: agendamento, error: null });
                }

                return Promise.resolve({ data: null, error: erroRegistroImagem });
            },
            delete() {
                operacao = 'delete';
                return this;
            },
            then(resolve, reject) {
                if (operacao === 'delete') {
                    chamadas.exclusoes.push(tabela);

                    const erroExclusao = tabela === 'agendamento_imagens'
                        ? erroExclusaoReferencias
                        : tabela === 'agendamentos'
                            ? erroExclusaoAgendamento
                            : null;

                    return Promise.resolve({ data: null, error: erroExclusao }).then(resolve, reject);
                }

                if (tabela === 'agendamento_imagens' && operacao === 'insert') {
                    return Promise.resolve({ data: null, error: erroRegistroImagem }).then(resolve, reject);
                }

                return Promise.resolve({ data: dados, error: null }).then(resolve, reject);
            }
        };

        return consulta;
    }

    return {
        chamadas,
        from(tabela) {
            return criarConsulta(tabela);
        },
        storage: {
            from(bucket) {
                assert.equal(bucket, 'agendamento-imagens');

                return {
                    async upload(caminho) {
                        chamadas.uploads.push(caminho);
                        return { error: erroUpload };
                    },
                    async remove(caminhos) {
                        chamadas.arquivosRemovidos.push(caminhos);
                        return { data: null, error: erroRemocaoStorage };
                    }
                };
            }
        }
    };
}

const dadosAgendamento = {
    nome: 'Cliente Teste',
    whatsapp: '13999999999',
    trabalho: 'Desenho de teste',
    estilo: 'Fine line',
    descricao: '',
    data: '2099-12-31',
    horario: '14:00',
    arquivos: [{
        originalname: 'teste.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('imagem de teste')
    }]
};

test('cria o agendamento e registra a imagem quando tudo funciona', async () => {
    const supabase = criarSupabaseSimulado();

    const resultado = await criarAgendamento(dadosAgendamento, supabase);

    assert.equal(resultado.id, 'agendamento-teste');
    assert.equal(supabase.chamadas.uploads.length, 1);
    assert.deepEqual(supabase.chamadas.exclusoes, []);
    assert.deepEqual(supabase.chamadas.arquivosRemovidos, []);
});

test('exclui o agendamento quando o upload falha', async () => {
    const supabase = criarSupabaseSimulado({
        erroUpload: new Error('Falha simulada no upload')
    });

    await assert.rejects(
        criarAgendamento(dadosAgendamento, supabase),
        /Não foi possível enviar uma das imagens/
    );

    assert.ok(supabase.chamadas.exclusoes.includes('agendamentos'));
    assert.ok(supabase.chamadas.exclusoes.includes('agendamento_imagens'));
    assert.deepEqual(supabase.chamadas.arquivosRemovidos, []);
});

test('remove arquivo e agendamento quando falha o registro da imagem', async () => {
    const supabase = criarSupabaseSimulado({
        erroRegistroImagem: new Error('Falha simulada no registro')
    });

    await assert.rejects(
        criarAgendamento(dadosAgendamento, supabase),
        /não foi possível registrar sua referência/
    );

    assert.equal(supabase.chamadas.uploads.length, 1);
    assert.equal(supabase.chamadas.arquivosRemovidos.length, 1);
    assert.equal(supabase.chamadas.arquivosRemovidos[0].length, 1);
    assert.ok(supabase.chamadas.exclusoes.includes('agendamento_imagens'));
    assert.ok(supabase.chamadas.exclusoes.includes('agendamentos'));
});

test('registra as falhas quando a própria compensação não consegue concluir a limpeza', async () => {
    const erros = {
        registro: new Error('Falha original no registro da imagem'),
        referencias: new Error('Falha ao excluir referências'),
        storage: new Error('Falha ao remover arquivos'),
        agendamento: new Error('Falha ao excluir agendamento')
    };

    const supabase = criarSupabaseSimulado({
        erroRegistroImagem: erros.registro,
        erroExclusaoReferencias: erros.referencias,
        erroRemocaoStorage: erros.storage,
        erroExclusaoAgendamento: erros.agendamento
    });

    const consoleErrorOriginal = console.error;
    const registrosConsole = [];

    console.error = (...args) => registrosConsole.push(args);

    try {
        await assert.rejects(
            criarAgendamento(dadosAgendamento, supabase),
            erro => {
                assert.match(erro.message, /não foi possível registrar sua referência/i);
                assert.equal(erro.originalError, erros.registro);
                assert.equal(erro.falhasCompensacao.length, 3);

                const etapas = erro.falhasCompensacao.map(falha => falha.etapa);

                assert.ok(etapas.includes('remover referências das imagens'));
                assert.ok(etapas.includes('remover arquivos do Storage'));
                assert.ok(etapas.includes('excluir agendamento recém-criado'));

                return true;
            }
        );

        assert.ok(supabase.chamadas.exclusoes.includes('agendamento_imagens'));
        assert.ok(supabase.chamadas.exclusoes.includes('agendamentos'));
        assert.equal(supabase.chamadas.arquivosRemovidos.length, 1);
        assert.equal(registrosConsole.length, 1);
        assert.match(registrosConsole[0][0], /compensação do agendamento não foi concluída integralmente/i);
    } finally {
        console.error = consoleErrorOriginal;
    }
});
