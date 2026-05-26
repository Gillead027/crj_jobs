"use client";

// Este arquivo monta as duas etapas do Gerador de Currículo CRJ.
import { AnimatePresence, motion } from "framer-motion";

// Este import traz o ícone usado no botão de voltar.
import { ArrowLeft } from "lucide-react";

// Este import permite guardar estados e recalcular o currículo quando o relato muda.
import { useMemo, useState } from "react";

// Este import traz o botão separado que baixa o currículo em PDF.
import { DownloadPdfButton } from "@/components/DownloadPdfButton";

// Este import traz a seção inicial moderna do produto.
import { HeroSection } from "@/components/HeroSection";

// Este import traz o componente que mostra a pré-visualização do currículo.
import { ResumePreview } from "@/components/ResumePreview";

// Este import traz o formulário onde o jovem escreve sua história.
import { ResumeStoryForm } from "@/components/ResumeStoryForm";

// Este import traz o carrossel de escolha de modelos visuais.
import { TemplateCarousel } from "@/components/TemplateCarousel";

// Este import traz a função que transforma relato em currículo e o exemplo inicial.
import { createResumeFromStory, exampleStory } from "@/lib/resume-generator";

// Este import traz informações do template escolhido para mostrar na etapa de preview.
import { getResumeTemplate } from "@/lib/resume-templates";

// Este import traz os tipos de etapa e template usados pela página.
import type { ResumeTemplateId } from "@/types/resume";

// Este tipo define as duas etapas visuais da experiência.
type PageStep =
  // Esta etapa é a página inicial onde o jovem escreve o relato.
  | "story"

  // Esta etapa é a página de pré-visualização do currículo.
  | "preview";

// Este componente renderiza a página principal do sistema.
export default function Home() {
  // Este estado guarda o relato digitado pelo jovem.
  const [story, setStory] = useState(exampleStory);

  // Este estado guarda se o usuário está na página inicial ou na pré-visualização.
  const [step, setStep] = useState<PageStep>("story");

  // Este estado guarda o template visual escolhido no carrossel.
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ResumeTemplateId>("classic-elegant");

  // Este estado mostra uma mensagem simples de erro, orientação ou sucesso.
  const [message, setMessage] = useState("");

  // Esta constante calcula o currículo sempre que o relato muda.
  const resume = useMemo(() => createResumeFromStory(story), [story]);

  // Esta constante busca nome e descrição do template selecionado.
  const selectedTemplate = getResumeTemplate(selectedTemplateId);

  // Esta função atualiza o relato e mantém o usuário na etapa de escrita.
  function handleStoryChange(nextStory: string) {
    // Esta linha salva o novo texto digitado pelo jovem.
    setStory(nextStory);

    // Esta linha limpa mensagens antigas quando o jovem volta a editar.
    setMessage("");
  }

  // Esta função roda quando o usuário clica em "Gerar currículo".
  function handleGenerate() {
    // Esta condição impede gerar currículo com texto muito curto.
    if (story.trim().length < 20) {
      // Esta linha mostra uma orientação amigável para o usuário.
      setMessage("Escreva um pouco mais sobre você antes de gerar o currículo.");

      // Este retorno encerra a função porque falta informação.
      return;
    }

    // Esta linha confirma que a pré-visualização foi criada.
    setMessage("Currículo gerado. Revise o modelo antes de baixar.");

    // Esta linha abre a segunda etapa com o currículo visual.
    setStep("preview");
  }

  // Esta função leva o usuário de volta para editar o relato.
  function handleBackToEdit() {
    // Esta linha volta para a primeira etapa.
    setStep("story");

    // Esta linha orienta o usuário sobre a edição.
    setMessage("Edite seu relato e gere novamente quando quiser.");
  }

  // Este retorno monta o fundo moderno e controla qual etapa aparece.
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff6ef_0,#f8fafc_34%,#f6f0ea_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      {/* Este bloco limita a largura para manter a leitura confortável. */}
      <div className="mx-auto w-full max-w-7xl">
        {/* AnimatePresence permite animar a troca entre as duas etapas. */}
        <AnimatePresence mode="wait">
          {/* Esta condição mostra a primeira página do fluxo. */}
          {step === "story" ? (
            <motion.div
              key="story-step"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Esta seção apresenta o projeto de forma moderna. */}
              <HeroSection />

              {/* Este bloco organiza formulário e galeria de templates. */}
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
                {/* Este componente recebe o relato do jovem. */}
                <ResumeStoryForm
                  story={story}
                  onStoryChange={handleStoryChange}
                  onGenerate={handleGenerate}
                  message={message}
                />

                {/* Este componente permite escolher o visual do currículo antes de gerar. */}
                <TemplateCarousel
                  selectedTemplateId={selectedTemplateId}
                  onSelectTemplate={setSelectedTemplateId}
                />
              </div>
            </motion.div>
          ) : (
            // Esta página mostra a pré-visualização depois que o currículo foi gerado.
            <motion.div
              key="preview-step"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Este cabeçalho da segunda etapa mostra ações de baixar e editar. */}
              <section className="flex flex-col gap-4 rounded-lg border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-200/60 backdrop-blur md:flex-row md:items-center md:justify-between">
                {/* Este bloco mostra o template selecionado. */}
                <div>
                  {/* Este texto pequeno indica que o currículo está pronto para revisão. */}
                  <p className="text-sm font-semibold text-teal-700">
                    Pré-visualização gerada
                  </p>

                  {/* Este título mostra o nome do template escolhido. */}
                  <h1 className="mt-1 text-2xl font-bold text-slate-950">
                    Modelo: {selectedTemplate.name}
                  </h1>

                  {/* Este texto reforça que o jovem pode voltar para editar. */}
                  <p className="mt-1 text-sm text-slate-600">
                    Revise o currículo, baixe em PDF ou volte para melhorar o relato.
                  </p>
                </div>

                {/* Este bloco agrupa os botões da etapa de pré-visualização. */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* Este botão volta para a primeira etapa sem apagar o texto. */}
                  <button
                    type="button"
                    onClick={handleBackToEdit}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-slate-700"
                  >
                    {/* Este ícone deixa claro que o usuário vai voltar. */}
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />

                    {/* Este texto mostra a ação de editar novamente. */}
                    Voltar e editar relato
                  </button>

                  {/* Este componente baixa o PDF usando o template selecionado. */}
                  <DownloadPdfButton
                    resume={resume}
                    canDownload
                    templateId={selectedTemplateId}
                    onStatusChange={setMessage}
                  />
                </div>
              </section>

              {/* Esta mensagem mostra o status de download ou orientação. */}
              <p className="min-h-6 text-sm font-medium text-slate-700" aria-live="polite">
                {message}
              </p>

              {/* Este bloco permite trocar o template também na tela de pré-visualização. */}
              <TemplateCarousel
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={setSelectedTemplateId}
              />

              {/* Este componente mostra o currículo no modelo visual escolhido. */}
              <ResumePreview resume={resume} templateId={selectedTemplateId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
