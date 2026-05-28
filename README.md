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
- `src/app/como-usar/page.tsx`: cria a pagina com passos simples de uso para equipe e jovens.
- `src/app/sobre/page.tsx`: cria a pagina institucional Sobre o Projeto.
- `src/app/globals.css`: guarda estilos globais e importa as camadas do Tailwind CSS.
- `src/app/api/gerar-curriculo/route.ts`: cria a rota de API que envia o relato para a IA e devolve JSON estruturado.
- `src/lib/gemini-resume.ts`: concentra a integracao com Gemini, o prompt, o schema JSON e a limpeza da resposta.
- `src/lib/resume-local-storage.ts`: guarda historico local e limite simples de geracoes no navegador.
- `src/lib/resume-feedback.ts`: salva apenas no LocalStorage a resposta simples dada depois do download.
- `src/components/HeroSection.tsx`: contem a abertura moderna da pagina inicial.
- `src/components/ResumeStoryForm.tsx`: contem o formulario onde o jovem escreve o relato.
- `src/components/ResumeSmartQuestions.tsx`: contem o modo Primeiro emprego e as perguntas opcionais que complementam o relato.
- `src/components/ResumeHistoryPanel.tsx`: mostra os ultimos curriculos salvos apenas no navegador.
- `src/components/TemplateCarousel.tsx`: contem a galeria de templates do curriculo.
- `src/components/ResumePreview.tsx`: escolhe qual template visual deve aparecer na pre-visualizacao.
- `src/components/ResumeEditor.tsx`: contem os campos para editar o curriculo gerado antes do PDF ou Word.
- `src/components/ElegantResumeTemplate.tsx`: contem o template Classico Elegante.
- `src/components/ModernResumeTemplate.tsx`: contem o template Moderno Profissional.
- `src/components/YoungApprenticeTemplate.tsx`: contem o template Jovem Aprendiz.
- `src/components/DownloadPdfButton.tsx`: contem o botao que baixa o curriculo em PDF usando o template escolhido.
- `src/components/DownloadDocxButton.tsx`: contem o botao que baixa o curriculo em Word editavel.
- `src/components/DownloadFeedback.tsx`: mostra a pergunta simples depois do download e salva a resposta localmente.
- `src/types/resume.ts`: contem os tipos TypeScript usados pelos dados do curriculo.
- `src/lib/resume-generator.ts`: contem a logica que transforma relato em curriculo.
- `src/lib/resume-templates.ts`: contem a lista dos modelos visuais disponiveis.
- `src/lib/resume-pdf.ts`: contem a logica que cria e baixa o PDF com o visual escolhido.
- `src/lib/resume-docx.ts`: contem a logica que cria e baixa o DOCX editavel.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000` no navegador.

## Paginas

- `/`: gerador principal de curriculo.
- `/como-usar`: pagina com o passo a passo simples de uso.
- `/sobre`: pagina institucional sobre empregabilidade, juventude, autonomia e inclusao produtiva.

## Como configurar a IA Gemini

Crie um arquivo `.env.local` com a chave da Gemini API:

```bash
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.5-flash
```

O arquivo `.env.example` mostra quais variaveis o projeto espera.

## Como preparar o deploy na Vercel

Na Vercel, configure as variaveis em `Project Settings` > `Environment Variables`.

Use estas variaveis:

```bash
GEMINI_API_KEY=sua_chave_da_gemini
GEMINI_MODEL=gemini-3.5-flash
```

O arquivo `.env.local` deve existir apenas no computador local. Ele esta no `.gitignore`, entao nao deve ser enviado para o repositorio.

A chave da Gemini API nao fica escrita no codigo. A rota de API le `process.env.GEMINI_API_KEY` no servidor, o que evita expor a chave no navegador.

Antes de publicar, rode:

```bash
npm run build
```

Se esse comando passar, o projeto esta pronto para o build de producao da Vercel.

## Como usar

1. Escreva um relato simples sobre o jovem.
2. Marque `Primeiro emprego` quando o curriculo for para jovem aprendiz, primeiro emprego ou pouca experiencia.
3. Responda as perguntas opcionais que fizerem sentido para complementar o relato.
4. Escolha um modelo visual.
5. Clique em `Gerar currículo`.
6. Veja a pre-visualizacao.
7. Clique em `Editar currículo` se quiser ajustar nome, contato, objetivo, experiencias, habilidades, formacao, cursos ou informacoes adicionais.
8. Clique em `Salvar alterações` para atualizar a pre-visualizacao, o PDF e o Word.
9. Clique em `Baixar currículo em PDF` ou `Baixar em Word`.
10. Responda ao feedback simples, que fica salvo apenas no navegador.

## Historico local

O sistema salva os ultimos curriculos gerados no `LocalStorage` do navegador.

Esse historico guarda nome, data de criacao, template usado e dados do curriculo.

Ele serve para abrir ou excluir curriculos recentes no mesmo navegador. Esses dados nao sao enviados para servidor por esse recurso.

## Limite local de uso

Existe uma protecao simples no navegador: no maximo 5 geracoes a cada 30 minutos.

Esse limite usa `LocalStorage` e ajuda a reduzir spam da IA no mesmo navegador, mas nao substitui seguranca de servidor.

## Analytics

O projeto usa `@vercel/analytics` para acompanhar uso geral da aplicacao.

Esse acompanhamento nao interfere na geracao do curriculo e nao substitui os cuidados de privacidade do historico local.

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

A rota `POST /api/gerar-curriculo` recebe um JSON com o relato do jovem, o modo Primeiro emprego e respostas complementares opcionais:

```json
{
  "relato": "Meu nome e Joao, tenho 18 anos, moro em Sao Paulo e ajudo meu tio na oficina.",
  "primeiroEmprego": true,
  "respostasComplementares": {
    "socialProject": "Participei de oficina de informatica",
    "informalWork": "Ajudo meu tio na oficina",
    "digitalSkills": "Canva e redes sociais",
    "preferredArea": "Atendimento e administrativo",
    "location": "Sao Paulo - SP",
    "contact": "(11) 99999-9999"
  }
}
```

A resposta vem organizada dentro de `curriculo`, com campos como `nome`, `idade`, `telefone`, `email`, `cidade`, `objetivoProfissional`, `formacao`, `experiencias`, `habilidades`, `cursos` e `informacoesAdicionais`.
