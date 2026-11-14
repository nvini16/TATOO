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
- Perfil do cliente;
- Navegação entre páginas;
- Identidade visual própria.

## Tecnologias

### Frontend

- **HTML5** — estrutura das páginas;
- **CSS3** — estilização e identidade visual;
- **JavaScript (ES Modules)** — lógica da aplicação;
- **React 19** — construção da interface;
- **React Router 7** — navegação entre páginas;
- **Vite 8** — servidor de desenvolvimento e ferramenta de build;
- **Lucide React** — biblioteca de ícones.

### Bibliotecas do frontend

- **@supabase/supabase-js** — comunicação com os serviços do Supabase;
- **date-fns 4** — manipulação e formatação de datas;
- **react-day-picker** — componentes de calendário;
- **sharp** — processamento de imagens.

### Backend

- **Node.js** — ambiente de execução JavaScript;
- **JavaScript (CommonJS)** — módulos utilizados no backend;
- **Express 5** — servidor e construção da API REST;
- **cors** — configuração de acesso entre diferentes origens;
- **dotenv** — carregamento de variáveis de ambiente;
- **Multer 2** — recebimento de arquivos enviados;
- **image-type** — identificação do formato dos arquivos de imagem;
- **@supabase/supabase-js** — integração do backend com o Supabase.

### Banco de dados, autenticação e armazenamento

- **Supabase** — plataforma de backend utilizada pelo projeto;
- **PostgreSQL** — banco de dados relacional;
- **Supabase Auth** — autenticação e gerenciamento de sessões;
- **Supabase Storage** — armazenamento de imagens e arquivos.

### Desenvolvimento e qualidade de código

- **npm** — gerenciamento de pacotes e dependências;
- **ESLint 10** — análise estática e identificação de problemas no código;
- **Git** — controle de versão;
- **GitHub** — hospedagem do repositório e gerenciamento do código.

### Hospedagem e implantação

- **GitHub Pages** — hospedagem do frontend;
- **Vercel** — hospedagem do backend.

## Estrutura do projeto

A estrutura atual do repositório está organizada da seguinte forma:

```text
TATOO/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── backend/
│   ├── lib/
│   │   └── supabase.js
│   ├── middleware/
│   │   ├── requireAdmin.js
│   │   ├── requireCliente.js
│   │   └── upload.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   └── criarAgendamento.js
│   ├── tests/
│   │   └── criarAgendamento.test.js
│   ├── utils/
│   │   └── normalizarWhatsapp.js
│   ├── images.jpg
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── teste-upload.js
│   └── vercel.json
│
├── scripts/
│   └── otimizar-imagem.mjs
│
├── src/
│   ├── assets/
│   │   ├── agendamentos/
│   │   │   └── agendamentos.png
│   │   ├── autoral/
│   │   │   ├── 20250813_153605.png
│   │   │   ├── 20251018_150246.jpg
│   │   │   ├── 20251230_184714.png
│   │   │   ├── 20251230_184723.png
│   │   │   ├── IMG_20260303_195541_822.jpg
│   │   │   ├── IMG_20260414_221922_977.jpg
│   │   │   ├── IMG_20260830_194256_986.png
│   │   │   └── file_000000008f40820e9fac7b2a3812bcbc.jpg
│   │   ├── cuidados/
│   │   │   ├── 3857.webp
│   │   │   ├── 3858.webp
│   │   │   ├── 3859.webp
│   │   │   ├── 3860.webp
│   │   │   ├── 3861.webp
│   │   │   ├── 3862.webp
│   │   │   ├── 3863.webp
│   │   │   ├── 3864.webp
│   │   │   ├── 3865.webp
│   │   │   ├── 3866.webp
│   │   │   ├── 3867.webp
│   │   │   └── 3868.webp
│   │   ├── hero/
│   │   │   ├── estatua-sem-fundo.png
│   │   │   └── fundo-nuvens.png
│   │   ├── login-image/
│   │   │   └── image-login.jpg
│   │   ├── logo/
│   │   │   └── marsali-tatoo-logo-fundo-none.png
│   │   ├── sobre/
│   │   │   ├── sobre-01.jpg
│   │   │   └── sobre-02.png
│   │   ├── svg/
│   │   │   ├── border.png.png
│   │   │   └── svg-img.svg
│   │   ├── trabalhos/
│   │   │   └── otimizadas/
│   │   │       ├── reserve.webp
│   │   │       ├── trabalho-1.webp
│   │   │       ├── trabalho-2.webp
│   │   │       ├── trabalho-3.webp
│   │   │       ├── trabalho-4.webp
│   │   │       ├── trabalho-5.webp
│   │   │       ├── trabalho-6.webp
│   │   │       ├── trabalho-7.webp
│   │   │       ├── trabalho-8.webp
│   │   │       ├── trabalho-9.webp
│   │   │       ├── trabalho-10.webp
│   │   │       ├── trabalho-11.webp
│   │   │       ├── trabalho-12.webp
│   │   │       ├── trabalho-13.webp
│   │   │       └── trabalho-14.webp
│   │   └── body.webp.jpeg
│   │
│   ├── components/
│   │   ├── clientePerfil/
│   │   │   ├── ClienteHistorico.jsx
│   │   │   └── ClienteReferencias.jsx
│   │   ├── insights/
│   │   │   ├── AgendamentosAtivos.jsx
│   │   │   ├── AgendamentosCancelados.jsx
│   │   │   ├── AgendamentosConcluidos.jsx
│   │   │   ├── AgendamentosFaltou.jsx
│   │   │   ├── IndicadorCard.jsx
│   │   │   ├── TaxaComparecimento.jsx
│   │   │   └── TotalAgendamentos.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminMenu.jsx
│   │   ├── Alert.jsx
│   │   ├── CalendarioAgendamento.jsx
│   │   ├── Cuidados.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── IndexadorImagens.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ScrollReveal.jsx
│   │   ├── Sobre.jsx
│   │   └── Trabalhos.jsx
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── pages/
│   │   ├── Agendamentos.jsx
│   │   ├── AgendamentosAdmin.jsx
│   │   ├── CadastroCliente.jsx
│   │   ├── ClientePerfil.jsx
│   │   ├── ClientesAdmin.jsx
│   │   ├── Home.jsx
│   │   ├── Insights.jsx
│   │   ├── LoginAdmin.jsx
│   │   ├── LoginCliente.jsx
│   │   ├── MarsaliUser.jsx
│   │   └── RedefinirSenha.jsx
│   │
│   ├── styles/
│   │   ├── CalendarioAgendamento.css
│   │   ├── Cuidados.css
│   │   ├── IndexadorImagens.css
│   │   ├── adminAgendamentos.css
│   │   ├── adminLayout.css
│   │   ├── adminMenu.css
│   │   ├── agendamento.css
│   │   ├── alert.css
│   │   ├── animations.css
│   │   ├── cadastro.css
│   │   ├── clienteHistorico.css
│   │   ├── clientePerfil.css
│   │   ├── clienteReferencias.css
│   │   ├── clientesAdmin.css
│   │   ├── footer.css
│   │   ├── global.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── insights.css
│   │   ├── login.css
│   │   ├── loginAdmin.css
│   │   ├── loginCliente.css
│   │   ├── marsaliUser.css
│   │   ├── redefinirSenha.css
│   │   ├── responsive.css
│   │   ├── sobre.css
│   │   └── trabalhos.css
│   │
│   ├── App.jsx
│   ├── Root.jsx
│   └── main.jsx
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── reference.html
└── vite.config.js
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
