"use client";

// Este arquivo guarda o carrossel onde o usuário escolhe o modelo visual do currículo.
import { motion } from "framer-motion";

// Este import traz um ícone para marcar o template selecionado.
import { Check } from "lucide-react";

// Este import traz a lista de templates disponíveis.
import { resumeTemplates } from "@/lib/resume-templates";

// Este import traz o tipo dos identificadores de template.
import type { ResumeTemplateId } from "@/types/resume";

// Este tipo organiza as propriedades recebidas pelo carrossel de templates.
type TemplateCarouselProps = {
  // Este campo informa qual template está selecionado agora.
  selectedTemplateId: ResumeTemplateId;

  // Esta função avisa a página quando o usuário clica em outro template.
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
};

// Este componente mostra cards clicáveis para escolher o visual do currículo.
export function TemplateCarousel({
  selectedTemplateId,
  onSelectTemplate,
}: TemplateCarouselProps) {
  // Este retorno monta uma lista horizontal que funciona bem no celular.
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26, duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-full overflow-hidden rounded-lg border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-5"
    >
      {/* Este cabeçalho explica que o usuário pode escolher o modelo visual. */}
      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        {/* Este título identifica a galeria de templates. */}
        <h2 className="break-words text-lg font-bold text-slate-950">Escolha o modelo</h2>

        {/* Este texto curto explica a interação sem ocupar muito espaço. */}
        <p className="break-words text-sm text-slate-600">Clique em um card para aplicar no currículo.</p>
      </div>

      {/* Este bloco empilha cards no celular e vira carrossel horizontal em telas maiores. */}
      <div className="mt-4 grid max-w-full gap-3 sm:-mx-1 sm:flex sm:snap-x sm:overflow-x-auto sm:px-1 sm:pb-2">
        {/* Este mapa cria um card para cada template disponível. */}
        {resumeTemplates.map((template) => {
          // Esta constante verifica se este card é o selecionado.
          const isSelected = template.id === selectedTemplateId;

          // Este retorno monta o card clicável do template.
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className={`w-full max-w-full overflow-hidden rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:w-[230px] sm:shrink-0 sm:snap-start ${
                isSelected
                  ? "border-slate-950 bg-white shadow-md"
                  : "border-slate-200 bg-white/80"
              }`}
              aria-pressed={isSelected}
            >
              {/* Esta faixa de cor dá uma prévia visual do template. */}
              <div
                className={`h-24 rounded-lg bg-gradient-to-br ${template.accentClassName} p-3`}
              >
                {/* Este mini layout simula um currículo em duas colunas. */}
                <div className="h-full rounded-md bg-white/70 p-2">
                  <div className="h-3 w-2/3 rounded bg-slate-800" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-slate-400" />
                  <div className="mt-4 grid grid-cols-[0.75fr_1.25fr] gap-2">
                    <div className="space-y-1">
                      <div className="h-1.5 rounded bg-slate-300" />
                      <div className="h-1.5 rounded bg-slate-300" />
                      <div className="h-1.5 rounded bg-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 rounded bg-slate-500" />
                      <div className="h-1.5 rounded bg-slate-300" />
                      <div className="h-1.5 rounded bg-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Este bloco mostra o nome do template e o indicador de seleção. */}
              <div className="mt-3 flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Este texto mostra o nome do template. */}
                  <p className="break-words font-bold text-slate-950">{template.name}</p>

                  {/* Este texto explica em uma frase o estilo do template. */}
                  <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                    {template.description}
                  </p>
                </div>

                {/* Esta condição mostra um check quando o template está selecionado. */}
                {isSelected ? (
                  <span className="shrink-0 rounded-full bg-slate-950 p-1 text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
