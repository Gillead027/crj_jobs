// Este arquivo cria a pagina "Como usar" com passos simples para equipe e jovens.
import { ArrowLeft, CheckCircle2, Download, FilePenLine, HelpCircle, Palette, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

// Esta metadata especifica melhora a aba do navegador e o compartilhamento da rota Como usar.
export const metadata: Metadata = {
  // Este titulo identifica a pagina de orientacao.
  title: "Como usar | Gerador de Currículo CRJ",

  // Esta descricao resume o objetivo pratico da pagina.
  description:
    "Passo a passo simples para gerar, revisar e baixar currículos em PDF ou Word no Gerador CRJ.",
};

// Esta lista guarda os passos pedidos em linguagem direta.
const usageSteps = [
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "1",

    // Este titulo usa a frase pedida para o primeiro passo.
    title: "Escreva sua história.",

    // Este texto explica o passo para jovens e equipe sem linguagem tecnica.
    description:
      "Conte quem você é, onde estuda, o que já fez, cursos, habilidades e experiências, mesmo que sejam informais.",

    // Este icone representa a escrita inicial do relato.
    Icon: FilePenLine,
  },
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "2",

    // Este titulo usa a frase pedida para o segundo passo.
    title: "Responda perguntas opcionais.",

    // Este texto explica que as perguntas ajudam, mas nao sao obrigatorias.
    description:
      "Preencha só o que souber. As perguntas ajudam a lembrar projetos, trabalhos, bairro, contato e área de interesse.",

    // Este icone representa apoio e duvidas simples.
    Icon: HelpCircle,
  },
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "3",

    // Este titulo usa a frase pedida para o terceiro passo.
    title: "Gere o currículo.",

    // Este texto explica a acao principal do sistema.
    description:
      "Clique no botão de gerar. O sistema organiza as informações em um currículo profissional.",

    // Este icone representa a criacao assistida do curriculo.
    Icon: Sparkles,
  },
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "4",

    // Este titulo usa a frase pedida para o quarto passo.
    title: "Edite se precisar.",

    // Este texto reforca que a equipe pode revisar antes de baixar.
    description:
      "Confira nome, telefone, objetivo, experiências, formação, cursos e habilidades. Ajuste o que precisar.",

    // Este icone representa revisao e correcao.
    Icon: CheckCircle2,
  },
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "5",

    // Este titulo usa a frase pedida para o quinto passo.
    title: "Escolha o modelo.",

    // Este texto explica que o visual pode ser trocado antes do download.
    description:
      "Selecione o modelo que combina melhor com a vaga ou com o perfil do jovem.",

    // Este icone representa escolha visual do curriculo.
    Icon: Palette,
  },
  {
    // Este numero marca a ordem do passo no fluxo.
    number: "6",

    // Este titulo usa a frase pedida para o sexto passo.
    title: "Baixe em PDF ou Word.",

    // Este texto explica a diferenca pratica entre os dois formatos.
    description:
      "Use PDF para enviar pronto. Use Word quando a equipe quiser editar o arquivo depois.",

    // Este icone representa download dos arquivos.
    Icon: Download,
  },
];

// Esta funcao renderiza a rota /como-usar.
export default function HowToUsePage() {
  // Este retorno monta uma pagina responsiva, simples e com boa leitura no celular.
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_35%,#f0fdf4_100%)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10 lg:px-8">
      {/* Este bloco central limita a largura para facilitar leitura dos passos. */}
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        {/* Este link permite voltar ao gerador pelo teclado ou mouse. */}
        <Link
          href="/"
          className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline-teal-700"
        >
          {/* Este icone indica retorno para a tela principal. */}
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />

          {/* Este texto deixa claro que o link volta ao gerador. */}
          <span className="min-w-0 break-words">Voltar ao gerador</span>
        </Link>

        {/* Esta secao apresenta a finalidade da pagina de ajuda. */}
        <section className="py-10 sm:py-14">
          {/* Esta etiqueta identifica a pagina como guia de uso. */}
          <p className="inline-flex max-w-full items-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm ring-1 ring-teal-100">
            {/* Este icone reforca que o conteudo e um guia rapido. */}
            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />

            {/* Este texto nomeia a pagina de orientacao. */}
            <span className="min-w-0 break-words">Como usar</span>
          </p>

          {/* Este titulo usa linguagem simples para equipe e jovens. */}
          <h1 className="mt-5 max-w-4xl break-words text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Um passo a passo simples para criar o currículo.
          </h1>

          {/* Este texto explica que o fluxo pode ser acompanhado pela equipe. */}
          <p className="mt-5 max-w-3xl break-words text-base leading-8 text-slate-700 sm:text-lg">
            A equipe pode usar esta página como guia durante o atendimento. O jovem
            também pode acompanhar sozinho, revisar com calma e escolher o formato final.
          </p>
        </section>

        {/* Esta lista ordenada preserva a sequencia real dos seis passos. */}
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Este mapa cria um card claro para cada passo do uso. */}
          {usageSteps.map(({ number, title, description, Icon }) => (
            <li
              key={number}
              className="min-w-0 rounded-lg border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-200/50"
            >
              {/* Este cabecalho do card mostra numero e icone do passo. */}
              <div className="flex min-w-0 items-center justify-between gap-3">
                {/* Este numero ajuda a equipe a seguir a ordem correta. */}
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  {number}
                </span>

                {/* Este icone diferencia visualmente cada etapa. */}
                <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              {/* Este titulo mostra o passo principal em texto curto. */}
              <h2 className="mt-4 break-words text-xl font-bold text-slate-950">
                {title}
              </h2>

              {/* Este texto complementa o passo sem termos tecnicos. */}
              <p className="mt-2 break-words text-sm leading-7 text-slate-600">
                {description}
              </p>
            </li>
          ))}
        </ol>

        {/* Esta secao final reforca privacidade e leva de volta ao uso real. */}
        <section className="py-10 sm:py-14">
          {/* Este bloco mostra uma orientacao de privacidade em destaque leve. */}
          <div className="rounded-lg border border-teal-100 bg-teal-50/85 p-5 sm:p-6">
            {/* Este titulo destaca o cuidado com dados pessoais. */}
            <h2 className="break-words text-2xl font-bold text-slate-950">
              Cuidado com privacidade
            </h2>

            {/* Este texto explica que o feedback simples fica local e nao envia dados pessoais. */}
            <p className="mt-2 max-w-3xl break-words text-sm leading-7 text-slate-700">
              Depois do download, o sistema pergunta se o currículo ficou bom. Essa
              resposta fica apenas no navegador e não envia dados pessoais, relato,
              telefone, e-mail ou currículo para um banco de feedback.
            </p>

            {/* Este link volta para a experiencia principal do gerador. */}
            <Link
              href="/"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/60 transition hover:bg-teal-800 focus-visible:outline-teal-700 sm:w-auto"
            >
              Abrir o gerador
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
