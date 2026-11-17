-- Exclusão transacional de um agendamento e de todos os registros
-- que dependem diretamente dele.
--
-- A API chama esta função usando a chave service_role, após validar
-- a sessão administrativa com requireAdmin.

-- Permissões mínimas adicionais para a rotina de exclusão.
-- O service_role já possui acesso de leitura às tabelas envolvidas.
grant delete on table
    public.historico_agendamentos,
    public.historico_conquistas
to service_role;

grant update (movimentacao_original_id), delete
on table public.movimentacoes_pontos
to service_role;

create or replace function public.excluir_agendamento_admin(p_id bigint)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
    v_eventos uuid[];
    v_movimentacoes uuid[];
begin
    -- Bloqueia o registro durante a operação e confirma sua existência.
    perform 1
    from public.agendamentos
    where id = p_id
    for update;

    if not found then
        return false;
    end if;

    -- Identifica os eventos de histórico deste agendamento.
    select coalesce(array_agg(evento_uuid), array[]::uuid[])
    into v_eventos
    from public.historico_agendamentos
    where agendamento_id = p_id;

    -- Localiza movimentações ligadas diretamente ao agendamento ou
    -- aos eventos de histórico que serão removidos.
    select coalesce(array_agg(id), array[]::uuid[])
    into v_movimentacoes
    from public.movimentacoes_pontos
    where agendamento_id = p_id
       or evento_uuid = any(v_eventos);

    -- Preserva movimentações externas que apontavam para uma
    -- movimentação excluída, removendo apenas a referência opcional.
    if cardinality(v_movimentacoes) > 0 then
        update public.movimentacoes_pontos
        set movimentacao_original_id = null
        where movimentacao_original_id = any(v_movimentacoes);

        delete from public.movimentacoes_pontos
        where id = any(v_movimentacoes);
    end if;

    delete from public.historico_conquistas
    where agendamento_id = p_id;

    delete from public.historico_agendamentos
    where agendamento_id = p_id;

    -- Os metadados de agendamento_imagens são removidos por ON DELETE CASCADE.
    -- O cadastro em public.clientes não é alterado.
    delete from public.agendamentos
    where id = p_id;

    return true;
end;
$$;

-- A função só pode ser chamada pelo backend autenticado com service_role.
revoke all on function public.excluir_agendamento_admin(bigint) from public, anon, authenticated;
grant execute on function public.excluir_agendamento_admin(bigint) to service_role;
