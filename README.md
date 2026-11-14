# TATOO

Site em desenvolvimento destinado à **Leticia Marsali**, desenvolvido como um MVP para apresentar seu trabalho com tatuagem e estabelecer a base para futuras funcionalidades.

> Projeto em construção. A estrutura e as funcionalidades ainda podem sofrer alterações.

## Sobre o projeto

O TATOO é uma aplicação web desenvolvida para criar uma presença digital para **Leticia Marsali** e apresentar seu trabalho de forma organizada.

A versão atual possui:

- Página inicial;
- Apresentação;
- Galeria de trabalhos;
- Página de login;
- Página de cadastro;
- Navegação entre páginas;
- Identidade visual própria.

## Tecnologias

- React
- Vite
- React Router
- JavaScript
- CSS

## Estrutura do projeto

```text
src/
├── assets/
│   ├── logo/
│   └── foto-do-braco-do-login.jpg
│
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Sobre.jsx
│   └── Trabalhos.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Cadastro.jsx
│
├── App.jsx
├── index.css
└── main.jsx
```

## Executando o projeto

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois, acesse o endereço exibido pelo Vite no terminal.

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção da aplicação.

```bash
npm run lint
```

Verifica possíveis problemas no código utilizando ESLint.

```bash
npm run preview
```

Executa uma prévia da versão de produção.

## Status

**Em desenvolvimento — MVP**

O projeto ainda está sendo estruturado. Novas funcionalidades e melhorias serão adicionadas conforme o desenvolvimento avançar.

## Cliente

**Leticia Marsali**

Site desenvolvido para apresentação de seu trabalho profissional.

## Perfil e autenticação de clientes

**Status: concluído e publicado**

A etapa de Perfil e Autenticação de Clientes foi integrada à branch `main` por meio do Pull Request [#4](https://github.com/nvini16/TATOO/pull/4) e publicada no site público.

### Funcionalidades entregues

- Cadastro e login de clientes com Supabase Auth;
- Acesso à área de perfil do cliente;
- Galeria de referências pessoais;
- Visualização da agenda e dos detalhes dos atendimentos;
- Histórico de atendimentos;
- Preservação da página de origem durante o fluxo de login e cadastro;
- Encerramento da sessão do cliente;
- Separação entre clientes com conta autenticada e clientes de agendamentos públicos.

Os agendamentos públicos não são vinculados ou transferidos automaticamente para uma conta quando uma pessoa realiza o cadastro. Os clientes autenticados são associados à sua identidade de autenticação.

### Validação em produção

Após a integração e publicação na branch principal, os seguintes fluxos foram verificados manualmente no site público:

| Verificação | Resultado |
|---|---|
| Acesso ao site publicado | Aprovado |
| Login em conta autenticada | Aprovado |
| Acesso e visualização do perfil | Aprovado |
| Acesso à galeria de referências | Aprovado |
| Visualização da agenda e dos detalhes | Aprovado |
| Visualização do histórico de atendimentos | Aprovado |

**Resultado:** os principais fluxos da experiência autenticada do cliente foram confirmados como funcionais no ambiente público.

### Escopo da validação

Esta validação confirma os fluxos funcionais descritos acima. Ela não representa uma auditoria completa de segurança, nem substitui testes de todos os cenários de autorização, falhas de rede, recuperação de conta ou operações administrativas.
