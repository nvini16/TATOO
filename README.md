# TATOO

Site em desenvolvimento destinado à **Leticia Marsali**, desenvolvido como um MVP para apresentar seu trabalho com tatuagem e estabelecer a base para futuras funcionalidades.

> Projeto em construção. A estrutura e as funcionalidades ainda podem sofrer alterações.

## Sobre o projeto

O **TATOO** é uma plataforma web desenvolvida para **Leticia Marsali**, com o objetivo de estabelecer sua presença digital, apresentar seu trabalho artístico e oferecer uma experiência integrada de atendimento aos clientes.

A aplicação reúne recursos de apresentação profissional, autenticação, agendamento e gerenciamento, conectando a experiência pública do site às funcionalidades disponíveis para clientes e administração.

### Funcionalidades disponíveis

- **Página inicial:** apresentação profissional e identidade visual da tatuadora;
- **Galeria de trabalhos:** exposição de tatuagens e produções autorais;
- **Área de clientes:** cadastro, login e gerenciamento de perfil;
- **Galeria de referências pessoais:** armazenamento e visualização de referências dos clientes;
- **Agendamentos:** solicitação e acompanhamento de atendimentos;
- **Histórico de atendimentos:** consulta aos registros de agendamentos anteriores;
- **Painel administrativo:** gerenciamento de clientes e agendamentos;
- **Dashboard de indicadores:** visualização de informações e métricas dos atendimentos;
- **Interface responsiva:** adaptação da experiência a diferentes tamanhos de tela.

O projeto utiliza uma arquitetura com frontend e backend integrados ao Supabase, permitindo organizar dados, autenticação e armazenamento de arquivos.

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

### 1. Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** — ambiente de execução JavaScript;
- **npm** — gerenciador de pacotes, instalado junto com o Node.js;
- **Git** — para clonar o repositório.

### 2. Clonando o repositório

Clone o repositório:

```bash
git clone https://github.com/nvini16/TATOO.git
```

Acesse a pasta do projeto:

```bash
cd TATOO
```

### 3. Instalando as dependências

Instale as dependências do frontend, na raiz do projeto:

```bash
npm install
```

Em seguida, acesse a pasta do backend e instale suas dependências:

```bash
cd backend
npm install
```

### 4. Configurando as variáveis de ambiente

O projeto utiliza arquivos `.env` para configurar a comunicação com o Supabase e a API local.

**Frontend — arquivo `.env` na raiz do projeto:**

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

**Backend — arquivo `backend/.env`:**

```env
PORT=3000
SUPABASE_URL=sua_url_supabase
SUPABASE_SECRET_KEY=sua_chave_secreta
```

Substitua os valores de exemplo pelas credenciais correspondentes ao seu projeto Supabase.

**Importante:** os arquivos `.env` estão listados no `.gitignore` para evitar que arquivos de configuração não rastreados sejam enviados ao GitHub. Essa regra não remove do controle de versão arquivos que já estejam rastreados.

### 5. Iniciando o projeto

O frontend e o backend devem ser executados simultaneamente em terminais separados.

**Backend**

No primeiro terminal, acesse a pasta `backend` e execute:

```bash
node server.js
```

O servidor será iniciado na porta `3000`, por padrão.

**Frontend**

Abra outro terminal na raiz do projeto e execute:

```bash
npm run dev
```

Após a inicialização, acesse o endereço apresentado pelo Vite no terminal.

### 6. Scripts disponíveis

Os comandos abaixo devem ser executados na raiz do projeto.

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do frontend. |
| `npm run build` | Gera a versão de produção do frontend. |
| `npm run lint` | Verifica possíveis problemas no código utilizando ESLint. |
| `npm run preview` | Executa uma prévia da versão de produção do frontend. |

**Backend — teste automatizado:**

Para executar os testes do backend, acesse a pasta `backend` e utilize:

```bash
npm test
```

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
