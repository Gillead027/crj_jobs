# Gerador de Currículo CRJ

Este projeto e a base de um sistema chamado **Gerador de Currículo CRJ**.

O objetivo e simples: o jovem escreve um relato sobre si, e a tela transforma esse relato em uma primeira versao de currículo profissional.

## O que cada arquivo faz

- `package.json`: guarda o nome do projeto, os comandos de execucao e as bibliotecas usadas. Esse arquivo e JSON puro, entao ele nao permite comentarios dentro dele.
- `package-lock.json`: trava as versoes instaladas das bibliotecas. Esse arquivo tambem e JSON puro e nao permite comentarios.
- `.env.example`: mostra quais variaveis de ambiente devem existir para a IA funcionar.
- `.gitignore`: lista arquivos gerados ou sensiveis que nao devem ir para o Git.
- `next.config.mjs`: configura o Next.js, que e o framework usado para criar a aplicacao.
- `next-env.d.ts`: guarda referencias de tipos criadas pelo Next.js para o TypeScript.
- `tsconfig.json`: configura o TypeScript, que ajuda a encontrar erros antes do sistema rodar.
- `postcss.config.mjs`: liga o Tailwind CSS ao processo de estilos do Next.js.
- `tailwind.config.ts`: diz ao Tailwind quais arquivos ele deve ler para gerar as classes de estilo.
- `eslint.config.mjs`: configura o ESLint, que ajuda a encontrar problemas no codigo.
- `src/app/layout.tsx`: cria a estrutura geral da pagina, como idioma, titulo e fonte base.
- `src/app/page.tsx`: contem o fluxo em duas etapas, da escrita do relato ate a pre-visualizacao.
- `src/app/globals.css`: guarda estilos globais e importa as camadas do Tailwind CSS.
- `src/app/api/gerar-curriculo/route.ts`: cria a rota de API que envia o relato para a IA e devolve JSON estruturado.
- `src/components/HeroSection.tsx`: contem a abertura moderna da pagina inicial.
- `src/components/ResumeStoryForm.tsx`: contem o formulario onde o jovem escreve o relato.
- `src/components/TemplateCarousel.tsx`: contem a galeria de templates do curriculo.
- `src/components/ResumePreview.tsx`: escolhe qual template visual deve aparecer na pre-visualizacao.
- `src/components/ElegantResumeTemplate.tsx`: contem o template Classico Elegante.
- `src/components/ModernResumeTemplate.tsx`: contem o template Moderno Profissional.
- `src/components/YoungApprenticeTemplate.tsx`: contem o template Jovem Aprendiz.
- `src/components/DownloadPdfButton.tsx`: contem o botao que baixa o curriculo em PDF usando o template escolhido.
- `src/types/resume.ts`: contem os tipos TypeScript usados pelos dados do curriculo.
- `src/lib/resume-generator.ts`: contem a logica que transforma relato em curriculo.
- `src/lib/resume-templates.ts`: contem a lista dos modelos visuais disponiveis.
- `src/lib/resume-pdf.ts`: contem a logica que cria e baixa o PDF com o visual escolhido.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000` no navegador.

## Como configurar a IA

Crie um arquivo `.env.local` com a chave da OpenAI:

```bash
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-4o-mini
```

O arquivo `.env.example` mostra quais variaveis o projeto espera.

## Como preparar o deploy na Vercel

Na Vercel, configure as variaveis em `Project Settings` > `Environment Variables`.

Use estas variaveis:

```bash
OPENAI_API_KEY=sua_chave_da_openai
OPENAI_MODEL=gpt-4o-mini
```

O arquivo `.env.local` deve existir apenas no computador local. Ele esta no `.gitignore`, entao nao deve ser enviado para o repositorio.

A chave da OpenAI nao fica escrita no codigo. A rota de API le `process.env.OPENAI_API_KEY` no servidor, o que evita expor a chave no navegador.

Antes de publicar, rode:

```bash
npm run build
```

Se esse comando passar, o projeto esta pronto para o build de producao da Vercel.

## Como usar

1. Escreva um relato simples sobre o jovem.
2. Escolha um modelo visual no carrossel.
3. Clique em `Gerar currículo`.
4. Veja a pre-visualizacao.
5. Clique em `Baixar currículo em PDF`.

## Campos do curriculo

O sistema organiza o relato nestes campos:

- nome
- idade
- telefone
- email
- cidade
- objetivo profissional
- formacao
- experiencias
- habilidades
- cursos
- informacoes adicionais

Quando algum dado nao aparece no relato, o campo fica vazio no codigo e a tela mostra uma sugestao de preenchimento.

## Rota de API

A rota `POST /api/gerar-curriculo` recebe um JSON com o relato do jovem:

```json
{
  "relato": "Meu nome e Joao, tenho 18 anos, moro em Sao Paulo e ajudo meu tio na oficina."
}
```

A resposta vem organizada dentro de `curriculo`, com campos como `nome`, `idade`, `telefone`, `email`, `cidade`, `objetivoProfissional`, `formacao`, `experiencias`, `habilidades`, `cursos` e `informacoesAdicionais`.
