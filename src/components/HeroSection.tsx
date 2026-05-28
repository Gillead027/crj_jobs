"use client";

// Este arquivo guarda a seção inicial que apresenta o produto para o jovem.
import { motion } from "framer-motion";

// Este import traz ícones prontos para deixar a interface mais clara.
import { CircleHelp, FileText, Info, Sparkles } from "lucide-react";
import Link from "next/link";

// Este componente mostra o título, a proposta do sistema e uma prévia visual do resultado.
export function HeroSection() {
  // Este retorno monta uma abertura moderna e responsiva para a primeira etapa.
  return (
    <section className="grid w-full max-w-full items-center gap-8 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      {/* Este bloco animado contém o texto principal da página inicial. */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="min-w-0 max-w-3xl"
      >
        {/* Esta etiqueta mostra que o produto pertence ao CRJ. */}
        <p className="inline-flex max-w-full items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm ring-1 ring-teal-100">
          {/* Este ícone reforça a ideia de criação assistida. */}
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />

          {/* Este texto identifica a ferramenta. */}
          <span className="min-w-0 break-words">Ferramenta CRJ para primeiro currículo</span>
        </p>

        {/* Este título chama atenção para a transformação do relato em currículo. */}
        <h1 className="mt-5 max-w-2xl break-words text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
          Transforme sua história em um currículo profissional.
        </h1>

        {/* Este texto explica a proposta em linguagem simples para jovens do CRJ. */}
        <p className="mt-4 max-w-2xl break-words text-base leading-8 text-slate-700 sm:text-lg">
          Escreva do seu jeito: quem você é, o que já fez, o que sabe e qual
          oportunidade busca. O Gerador de Currículo CRJ organiza tudo em um
          modelo bonito, profissional e pronto para baixar.
        </p>

        {/* Este bloco agrupa links de orientacao sem tirar foco do formulario principal. */}
        <div className="mt-5 flex max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
          {/* Este link abre a pagina de passos simples para equipe e jovens. */}
          <Link
            href="/como-usar"
            className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-slate-300 bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-teal-700"
          >
            {/* Este icone indica ajuda de uso. */}
            <CircleHelp className="h-4 w-4 shrink-0" aria-hidden="true" />

            {/* Este texto mantem a rota /como-usar visivel no gerador. */}
            <span className="min-w-0 break-words">Como usar</span>
          </Link>

          {/* Este link abre a página institucional sem sair do projeto. */}
          <Link
            href="/sobre"
            className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-teal-200 bg-white/75 px-4 py-2 text-sm font-bold text-teal-800 transition hover:bg-white focus-visible:outline-teal-700"
          >
            {/* Este ícone indica que o link leva a informações sobre o projeto. */}
            <Info className="h-4 w-4 shrink-0" aria-hidden="true" />

            {/* Este texto mantém o acesso à rota /sobre visível no gerador. */}
            <span className="min-w-0 break-words">Sobre o projeto</span>
          </Link>
        </div>
      </motion.div>

      {/* Este bloco animado mostra uma miniatura visual do currículo final. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
        className="hidden rounded-lg border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/70 backdrop-blur lg:block"
        aria-hidden="true"
      >
        {/* Este cabeçalho simula o topo de um currículo premium. */}
        <div className="rounded-lg bg-[#f4eee6] p-5">
          {/* Este ícone mostra que a miniatura representa um documento. */}
          <FileText className="h-5 w-5 text-[#9a5b44]" />

          {/* Esta linha simula o nome grande no currículo. */}
          <div className="mt-5 h-7 w-56 rounded bg-[#2f2a27]" />

          {/* Esta linha simula o objetivo em itálico abaixo do nome. */}
          <div className="mt-3 h-3 w-44 rounded bg-[#b77b62]" />

          {/* Este bloco simula as duas colunas do currículo. */}
          <div className="mt-8 grid grid-cols-[0.75fr_1.25fr] gap-5">
            {/* Esta coluna simula contatos e habilidades. */}
            <div className="space-y-3">
              <div className="h-3 rounded bg-[#9a5b44]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
            </div>

            {/* Esta coluna simula experiências e formação. */}
            <div className="space-y-3">
              <div className="h-3 rounded bg-[#9a5b44]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
              <div className="h-3 rounded bg-[#9a5b44]" />
              <div className="h-2 rounded bg-[#d8c7b9]" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
