"use client";

// Este arquivo monta as duas etapas do Gerador de Currículo CRJ.
import { AnimatePresence, motion } from "framer-motion";

// Este import traz os ícones usados nos botões de voltar e editar currículo.
import { ArrowLeft, Pencil } from "lucide-react";

// Este import permite guardar estados da tela, do currículo e do carregamento da IA.
import { useState } from "react";

// Este import traz o botão separado que baixa o currículo em PDF.
import { DownloadPdfButton } from "@/components/DownloadPdfButton";

// Este import traz a seção inicial moderna do produto.
import { HeroSection } from "@/components/HeroSection";

// Este import traz o componente que mostra a pré-visualização do currículo.
import { ResumePreview } from "@/components/ResumePreview";

// Este import traz o editor aberto depois que o currículo foi gerado.
import { ResumeEditor } from "@/components/ResumeEditor";

// Este import traz o formulário onde o jovem escreve sua história.
import { ResumeStoryForm } from "@/components/ResumeStoryForm";

// Este import traz o carrossel de escolha de modelos visuais.
import { TemplateCarousel } from "@/components/TemplateCarousel";

// Este import traz a função que transforma relato em currículo e o exemplo inicial.
import { createResumeFromStory, exampleStory } from "@/lib/resume-generator";

// Este import traz informações do template escolhido para mostrar na etapa de preview.
import { getResumeTemplate } from "@/lib/resume-templates";

// Este import traz os tipos de dados usados pela página e pela resposta da API.
import type {
  AiResumeJson,
  LoadingProgressStatus,
  ResumeApiErrorResponse,
  ResumeApiSuccessResponse,
  ResumeData,
  ResumeTemplateId,
} from "@/types/resume";

// Este tipo define as duas etapas visuais da experiência.
type PageStep =
  // Esta etapa é a página inicial onde o jovem escreve o relato.
  | "story"

  // Esta etapa é a página de pré-visualização do currículo.
  | "preview";

// Esta constante define a porcentagem inicial da barra assim que o usuário clica no botão.
const initialLoadingProgress = 5;

// Esta constante define o limite máximo enquanto a IA ainda não respondeu.
const waitingLoadingLimit = 90;

// Esta constante define o tempo para mostrar a barra em 100% antes de abrir a pré-visualização.
const successPreviewDelay = 650;

// Esta constante guarda a mensagem padrão quando a IA falha sem devolver um motivo amigável.
const genericAiErrorMessage =
  "Não foi possível gerar com IA agora. Tente novamente em instantes.";

// Esta função converte o JSON em português vindo da IA para o formato usado pelos componentes.
function mapAiResumeToResumeData(curriculo: AiResumeJson): ResumeData {
  // Este retorno mantém os mesmos dados, apenas mudando os nomes dos campos para o padrão da tela.
  return {
    // Este campo coloca o nome da IA no campo usado pelos templates.
    name: curriculo.nome,

    // Este campo coloca a idade da IA no campo usado pelos templates.
    age: curriculo.idade,

    // Este campo coloca o telefone da IA no campo usado pelos templates.
    phone: curriculo.telefone,

    // Este campo coloca o e-mail da IA no campo usado pelos templates.
    email: curriculo.email,

    // Este campo coloca a cidade da IA no campo usado pelos templates.
    city: curriculo.cidade,

    // Este campo coloca o objetivo profissional curto no cabeçalho do currículo.
    professionalObjective: curriculo.objetivoProfissional,

    // Este campo coloca a formação escolar no currículo.
    education: curriculo.formacao,

    // Esta lista coloca experiências formais ou informais no currículo.
    experiences: curriculo.experiencias,

    // Esta lista coloca habilidades no currículo.
    skills: curriculo.habilidades,

    // Esta lista coloca cursos no currículo.
    courses: curriculo.cursos,

    // Esta lista coloca informações adicionais no currículo.
    additionalInfo: curriculo.informacoesAdicionais,
  };
}

// Esta função verifica se uma resposta desconhecida parece ser erro da API.
function isApiErrorResponse(value: unknown): value is ResumeApiErrorResponse {
  // Esta linha confirma que existe um objeto com uma mensagem de erro em texto.
  return (
    value !== null &&
    typeof value === "object" &&
    "erro" in value &&
    typeof (value as ResumeApiErrorResponse).erro === "string"
  );
}

// Esta função espera alguns milissegundos antes de continuar o fluxo.
function wait(milliseconds: number) {
  // Este retorno cria uma pausa controlada para o usuário ver a barra completar 100%.
  return new Promise((resolve) => {
    // Esta linha encerra a pausa depois do tempo definido.
    window.setTimeout(resolve, milliseconds);
  });
}

// Esta função escolhe uma mensagem segura para mostrar quando a rota de IA falhar.
function getFriendlyAiErrorMessage(error: unknown) {
  // Esta constante usa a mensagem vinda da API, como a falta de GEMINI_API_KEY no servidor.
  const errorMessage = error instanceof Error ? error.message.trim() : "";

  // Este retorno evita mostrar texto vazio e mantém a interface com orientação amigável.
  return errorMessage || genericAiErrorMessage;
}

// Esta função envia o relato para a rota segura do Next.js, que roda no servidor.
async function requestAiResume(story: string) {
  // Esta chamada usa caminho relativo para funcionar tanto localmente quanto na Vercel.
  const response = await fetch("/api/gerar-curriculo", {
    // Este método envia o relato para a API em vez de colocar dados na URL.
    method: "POST",

    // Este cabeçalho informa que o corpo da requisição é JSON.
    headers: { "Content-Type": "application/json" },

    // Este corpo envia apenas o relato; a chave da Gemini API fica protegida no servidor.
    body: JSON.stringify({ relato: story }),
  });

  // Esta linha lê o JSON de sucesso ou erro devolvido pela rota.
  const data: unknown = await response.json();

  // Esta condição transforma erro da API em mensagem amigável para a tela.
  if (!response.ok) {
    // Esta constante pega a mensagem da API quando ela existir.
    const apiMessage = isApiErrorResponse(data) ? data.erro : "";

    // Este erro será tratado pela tela, que para a barra e pede para tentar novamente.
    throw new Error(
      apiMessage || "Não foi possível gerar o currículo com IA. Tente novamente em instantes.",
    );
  }

  // Esta constante trata o retorno como resposta de sucesso depois da validação HTTP.
  const successData = data as ResumeApiSuccessResponse;

  // Esta linha converte o JSON da IA para o formato visual da aplicação.
  return mapAiResumeToResumeData(successData.curriculo);
}

// Este componente renderiza a página principal do sistema.
export default function Home() {
  // Este estado guarda o relato digitado pelo jovem.
  const [story, setStory] = useState(exampleStory);

  // Este estado guarda o currículo que será mostrado na pré-visualização e no PDF.
  const [resume, setResume] = useState<ResumeData>(() =>
    createResumeFromStory(exampleStory),
  );

  // Este estado guarda se o usuário está na página inicial ou na pré-visualização.
  const [step, setStep] = useState<PageStep>("story");

  // Este estado guarda o template visual escolhido no carrossel.
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ResumeTemplateId>("classic-elegant");

  // Este estado mostra uma mensagem simples de erro, orientação ou sucesso.
  const [message, setMessage] = useState("");

  // Este estado informa se a IA está gerando o currículo agora.
  const [isGenerating, setIsGenerating] = useState(false);

  // Este estado guarda a porcentagem exibida na barra de progresso.
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Este estado informa se a barra está parada, carregando, concluída ou com erro.
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingProgressStatus>("idle");

  // Este estado guarda uma mensagem amigável quando a IA falha.
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("");

  // Este estado controla se os campos editáveis do currículo gerado estão abertos.
  const [isEditingResume, setIsEditingResume] = useState(false);

  // Esta constante busca nome e descrição do template selecionado.
  const selectedTemplate = getResumeTemplate(selectedTemplateId);

  // Esta função atualiza o relato e mantém o usuário na etapa de escrita.
  function handleStoryChange(nextStory: string) {
    // Esta linha salva o novo texto digitado pelo jovem.
    setStory(nextStory);

    // Esta linha limpa mensagens antigas quando o jovem volta a editar.
    setMessage("");

    // Esta linha esconde a barra caso o jovem edite depois de uma falha.
    setLoadingStatus("idle");

    // Esta linha zera a porcentagem para a próxima tentativa começar em 5%.
    setLoadingProgress(0);

    // Esta linha remove o erro antigo depois que o jovem volta a mexer no relato.
    setLoadingErrorMessage("");
  }

  // Esta função roda quando o usuário clica em "Gerar currículo".
  async function handleGenerate() {
    // Esta condição impede gerar currículo com texto muito curto.
    if (story.trim().length < 20) {
      // Esta linha mostra uma orientação amigável para o usuário.
      setMessage("Escreva um pouco mais sobre você antes de gerar o currículo.");

      // Esta linha garante que a barra não apareça quando o relato ainda está curto.
      setLoadingStatus("idle");

      // Este retorno encerra a função porque falta informação.
      return;
    }

    // Esta condição evita enviar duas requisições para a IA se o usuário clicar várias vezes.
    if (isGenerating) {
      // Este retorno mantém a chamada atual em andamento.
      return;
    }

    // Esta linha limpa mensagens simples porque a barra vai mostrar o carregamento visual.
    setMessage("");

    // Esta linha remove erro antigo antes de começar uma nova tentativa.
    setLoadingErrorMessage("");

    // Esta linha bloqueia novo envio enquanto a IA processa o relato.
    setIsGenerating(true);

    // Esta linha mostra a barra imediatamente começando em 5%, como pedido.
    setLoadingProgress(initialLoadingProgress);

    // Esta linha coloca a barra no estado de carregamento.
    setLoadingStatus("loading");

    // Esta constante cria um temporizador que simula avanço enquanto a IA trabalha.
    const progressTimer = window.setInterval(() => {
      // Esta atualização usa o valor anterior para preencher gradualmente até 90%.
      setLoadingProgress((currentProgress) => {
        // Esta condição trava a barra em 90% enquanto a resposta da IA não chega.
        if (currentProgress >= waitingLoadingLimit) {
          // Este retorno mantém a espera sem prometer conclusão antes da IA responder.
          return waitingLoadingLimit;
        }

        // Esta constante acelera no começo e desacelera perto do limite de espera.
        const nextStep =
          currentProgress < 35 ? 6 : currentProgress < 65 ? 4 : 2;

        // Este retorno avança a barra sem passar de 90% antes da resposta.
        return Math.min(waitingLoadingLimit, currentProgress + nextStep);
      });
    }, 520);

    // Este bloco tenta usar a IA e só avança para a pré-visualização quando houver sucesso.
    try {
      // Esta linha chama a API interna, que usa GEMINI_API_KEY apenas no servidor.
      const aiResume = await requestAiResume(story.trim());

      // Esta linha para a simulação porque a IA já respondeu.
      window.clearInterval(progressTimer);

      // Esta linha salva o currículo profissional devolvido pela IA.
      setResume(aiResume);

      // Esta linha fecha o editor caso o usuário gere uma nova versão do currículo.
      setIsEditingResume(false);

      // Esta linha coloca a barra no estado de sucesso para mudar mensagem e ícone.
      setLoadingStatus("success");

      // Esta linha completa a barra em 100% somente depois da resposta da IA.
      setLoadingProgress(100);

      // Esta linha mantém o 100% visível por um instante antes da transição de página.
      await wait(successPreviewDelay);

      // Esta linha confirma que a pré-visualização foi criada com IA.
      setMessage("Currículo gerado com IA. Revise o modelo antes de baixar.");

      // Esta linha libera o botão depois da geração bem-sucedida.
      setIsGenerating(false);

      // Esta linha abre a segunda etapa somente depois da barra chegar a 100%.
      setStep("preview");
    } catch (error) {
      // Esta linha para a simulação porque houve falha na IA.
      window.clearInterval(progressTimer);

      // Esta linha registra o erro no console para investigação, sem mostrar detalhes técnicos ao usuário.
      console.error("Falha ao gerar currículo com IA:", error);

      // Esta linha libera o botão para o jovem tentar gerar novamente.
      setIsGenerating(false);

      // Esta linha muda a barra para erro e impede avanço para a pré-visualização.
      setLoadingStatus("error");

      // Esta linha mostra uma mensagem curta, amigável e sem detalhe técnico.
      setLoadingErrorMessage(getFriendlyAiErrorMessage(error));
    }
  }

  // Esta função leva o usuário de volta para editar o relato.
  function handleBackToEdit() {
    // Esta linha volta para a primeira etapa.
    setStep("story");

    // Esta linha orienta o usuário sobre a edição.
    setMessage("Edite seu relato e gere novamente quando quiser.");

    // Esta linha esconde a barra quando o usuário volta da pré-visualização.
    setLoadingStatus("idle");

    // Esta linha zera a barra para uma próxima geração.
    setLoadingProgress(0);

    // Esta linha limpa qualquer erro antigo ao voltar para edição.
    setLoadingErrorMessage("");

    // Esta linha fecha os campos do currículo porque o usuário voltou para editar o relato.
    setIsEditingResume(false);
  }

  // Esta função abre ou fecha o editor do currículo gerado.
  function handleToggleResumeEditor() {
    // Esta linha alterna o painel de edição sem alterar a pré-visualização ainda.
    setIsEditingResume((currentValue) => !currentValue);
  }

  // Esta função salva alterações manuais no currículo já gerado.
  function handleSaveResumeChanges(nextResume: ResumeData) {
    // Esta linha atualiza o mesmo estado usado pela pré-visualização e pelo botão de PDF.
    setResume(nextResume);

    // Esta linha fecha o editor depois de aplicar os dados editados.
    setIsEditingResume(false);

    // Esta mensagem confirma que o PDF usará as informações atualizadas.
    setMessage("Alterações salvas. A pré-visualização e o PDF foram atualizados.");
  }

  // Este retorno monta o fundo moderno e controla qual etapa aparece.
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff6ef_0,#f8fafc_34%,#f6f0ea_100%)] px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      {/* Este bloco limita a largura para manter a leitura confortável. */}
      <div className="mx-auto w-full max-w-7xl overflow-hidden">
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
              className="w-full max-w-full space-y-8 overflow-hidden"
            >
              {/* Esta seção apresenta o projeto de forma moderna. */}
              <HeroSection />

              {/* Este bloco organiza formulário e galeria de templates. */}
              <div className="grid w-full max-w-full min-w-0 gap-6 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)]">
                {/* Este componente recebe o relato do jovem. */}
                <ResumeStoryForm
                  story={story}
                  onStoryChange={handleStoryChange}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  loadingProgress={loadingProgress}
                  loadingStatus={loadingStatus}
                  loadingErrorMessage={loadingErrorMessage}
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
              className="w-full max-w-full space-y-6 overflow-hidden"
            >
              {/* Este cabeçalho da segunda etapa mostra ações de baixar e editar. */}
              <section className="flex w-full max-w-full flex-col gap-4 overflow-hidden rounded-lg border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-200/60 backdrop-blur md:flex-row md:items-center md:justify-between">
                {/* Este bloco mostra o template selecionado. */}
                <div className="min-w-0">
                  {/* Este texto pequeno indica que o currículo está pronto para revisão. */}
                  <p className="text-sm font-semibold text-teal-700">
                    Pré-visualização gerada
                  </p>

                  {/* Este título mostra o nome do template escolhido. */}
                  <h1 className="mt-1 break-words text-xl font-bold text-slate-950 sm:text-2xl">
                    Modelo: {selectedTemplate.name}
                  </h1>

                  {/* Este texto reforça que o jovem pode voltar para editar. */}
                  <p className="mt-1 break-words text-sm text-slate-600">
                    Revise o currículo, edite os campos, baixe em PDF ou volte para melhorar o relato.
                  </p>
                </div>

                {/* Este bloco agrupa os botões da etapa de pré-visualização. */}
                <div className="flex w-full max-w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {/* Este botão volta para a primeira etapa sem apagar o texto. */}
                  <button
                    type="button"
                    onClick={handleBackToEdit}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-slate-700 sm:w-auto"
                  >
                    {/* Este ícone deixa claro que o usuário vai voltar. */}
                    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />

                    {/* Este texto mostra a ação de editar novamente. */}
                    <span className="min-w-0 break-words">Voltar e editar relato</span>
                  </button>

                  {/* Este botão abre os campos editáveis do currículo já gerado. */}
                  <button
                    type="button"
                    onClick={handleToggleResumeEditor}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-teal-600 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 transition hover:bg-teal-100 focus-visible:outline-teal-700 sm:w-auto"
                    aria-expanded={isEditingResume}
                  >
                    {/* Este ícone indica que a ação abre edição direta do currículo. */}
                    <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />

                    {/* Este texto atende ao pedido de criar o botão Editar currículo. */}
                    <span className="min-w-0 break-words">Editar currículo</span>
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
              <p className="min-h-6 break-words text-sm font-medium text-slate-700" aria-live="polite">
                {message}
              </p>

              {/* Esta condição mostra o editor somente quando o usuário pede para ajustar o currículo. */}
              {isEditingResume ? (
                <ResumeEditor resume={resume} onSave={handleSaveResumeChanges} />
              ) : null}

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
