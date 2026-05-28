// Este arquivo cria a página institucional "Sobre o Projeto".
// Ela explica a proposta pública do gerador sem acessar histórico, relato ou dados locais do usuário.
import { ArrowLeft, BriefcaseBusiness, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

// Esta metadata específica melhora a aba do navegador e o compartilhamento da página Sobre.
export const metadata: Metadata = {
  // Este título identifica a página institucional.
  title: "Sobre o Projeto | Gerador de Currículo CRJ",

  // Esta descrição resume a finalidade social e prática do sistema.
  description:
    "Conheça o projeto que ajuda jovens a transformar experiências em currículos profissionais.",
};

// Esta lista organiza os pilares institucionais mostrados na página.
const projectPillars = [
  {
    // Este título fala da ponte entre trajetória e oportunidade.
    title: "Empregabilidade",

    // Este texto explica o benefício prático sem prometer vaga ou resultado automático.
    description:
      "O sistema organiza experiências, estudos, cursos e habilidades em uma linguagem clara para processos seletivos.",

    // Este ícone reforça visualmente o tema de trabalho.
    Icon: BriefcaseBusiness,
  },
  {
    // Este título destaca protagonismo juvenil.
    title: "Juventude",

    // Este texto valoriza vivências reais sem usar rótulos ou linguagem estigmatizante.
    description:
      "A ferramenta reconhece que projetos, escola, cursos, ajuda familiar e atividades informais também podem revelar competências.",

    // Este ícone traz uma leitura positiva de potencial e crescimento.
    Icon: Sparkles,
  },
  {
    // Este título destaca autonomia no uso.
    title: "Autonomia",

    // Este texto explica que o jovem pode revisar, editar e baixar o currículo.
    description:
      "Depois de gerar, cada pessoa pode ajustar as informações, escolher o modelo visual e baixar o PDF ou Word.",

    // Este ícone simboliza apoio e escolha.
    Icon: Handshake,
  },
  {
    // Este título apresenta o cuidado com dados.
    title: "Privacidade",

    // Este texto explica que histórico e limite são recursos locais do navegador.
    description:
      "O histórico recente e o limite simples de uso ficam no navegador e não criam banco de currículos no servidor.",

    // Este ícone reforça o cuidado com privacidade.
    Icon: ShieldCheck,
  },
];

// Esta função renderiza a rota /sobre.
export default function AboutPage() {
  // Este retorno monta uma página moderna, responsiva e focada na explicação institucional.
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,#dcfce7_0,#f8fafc_34%,#eff6ff_100%)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10 lg:px-8">
      {/* Este bloco central limita a largura e mantém boa leitura em celulares. */}
      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        {/* Este link volta para o gerador principal. */}
        <Link
          href="/"
          className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline-teal-700"
        >
          {/* Este ícone indica retorno para a tela anterior. */}
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />

          {/* Este texto deixa claro que o usuário volta ao gerador. */}
          <span className="min-w-0 break-words">Voltar ao gerador</span>
        </Link>

        {/* Esta seção apresenta o objetivo central do projeto. */}
        <section className="py-10 sm:py-14">
          {/* Esta etiqueta posiciona a página como conteúdo institucional. */}
          <p className="inline-flex max-w-full items-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm ring-1 ring-teal-100">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">Sobre o Projeto</span>
          </p>

          {/* Este título explica o papel do sistema em linguagem direta. */}
          <h1 className="mt-5 max-w-4xl break-words text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Uma ferramenta para transformar experiências em currículo profissional.
          </h1>

          {/* Este texto descreve o propósito sem linguagem estigmatizante. */}
          <p className="mt-5 max-w-3xl break-words text-base leading-8 text-slate-700 sm:text-lg">
            O Gerador de Currículo CRJ apoia jovens na organização de suas trajetórias,
            estudos, habilidades e vivências em um documento simples, objetivo e pronto
            para processos de seleção.
          </p>

          {/* Este texto reforça inclusão produtiva e autonomia de forma positiva. */}
          <p className="mt-4 max-w-3xl break-words text-base leading-8 text-slate-700 sm:text-lg">
            A proposta é fortalecer empregabilidade, autonomia e inclusão produtiva,
            ajudando cada jovem a reconhecer competências construídas na escola, em
            cursos, projetos, atividades comunitárias, experiências informais e no dia a dia.
          </p>
        </section>

        {/* Esta seção mostra os pilares do projeto em cards independentes e responsivos. */}
        <section className="grid gap-4 sm:grid-cols-2">
          {/* Este mapa cria uma apresentação compacta dos pilares institucionais. */}
          {projectPillars.map(({ title, description, Icon }) => (
            <article
              key={title}
              className="min-w-0 rounded-lg border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/50 backdrop-blur"
            >
              {/* Este ícone dá sinal visual ao pilar. */}
              <div className="inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              {/* Este título identifica o pilar. */}
              <h2 className="mt-4 break-words text-xl font-bold text-slate-950">
                {title}
              </h2>

              {/* Este texto explica o pilar em linguagem simples e profissional. */}
              <p className="mt-2 break-words text-sm leading-7 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </section>

        {/* Esta seção final chama o usuário para voltar ao gerador. */}
        <section className="py-10 sm:py-14">
          {/* Este bloco usa faixa simples em vez de depender de uma página longa de marketing. */}
          <div className="rounded-lg border border-teal-100 bg-teal-50/80 p-5 sm:p-6">
            <h2 className="break-words text-2xl font-bold text-slate-950">
              Comece pelo que você já viveu.
            </h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-7 text-slate-700">
              O sistema ajuda a transformar o relato em uma primeira versão de currículo.
              Depois, o currículo pode ser revisado, editado e baixado em PDF ou Word.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/60 transition hover:bg-teal-800 focus-visible:outline-teal-700 sm:w-auto"
            >
              Voltar ao gerador
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
