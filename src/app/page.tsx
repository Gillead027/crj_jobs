"use client";

// Este arquivo monta as duas etapas do Gerador de Currículo CRJ.
import { AnimatePresence, motion } from "framer-motion";

// Este import traz o ícone usado no botão de voltar.
import { ArrowLeft } from "lucide-react";

// Este import permite guardar estados da tela, do currículo e do carregamento da IA.
import { useState } from "react";

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

// Este import traz os tipos de dados usados pela página e pela resposta da API.
import type {
  AiResumeJson,
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

// Esta função envia o relato para a rota segura do Next.js, que roda no servidor.
async function requestAiResume(story: string) {
  // Esta chamada usa caminho relativo para funcionar tanto localmente quanto na Vercel.
  const response = await fetch("/api/gerar-curriculo", {
    // Este método envia o relato para a API em vez de colocar dados na URL.
    method: "POST",

    // Este cabeçalho informa que o corpo da requisição é JSON.
    headers: { "Content-Type": "application/json" },

    // Este corpo envia apenas o relato; a chave da OpenAI fica protegida no servidor.
    body: JSON.stringify({ relato: story }),
  });

  // Esta linha lê o JSON de sucesso ou erro devolvido pela rota.
  const data: unknown = await response.json();

  // Esta condição transforma erro da API em mensagem amigável para a tela.
  if (!response.ok) {
    // Esta constante pega a mensagem da API quando ela existir.
    const apiMessage = isApiErrorResponse(data) ? data.erro : "";

    // Este erro será tratado pelo fallback local, sem quebrar a experiência do jovem.
    throw new Error(apiMessage || "Não foi possível gerar o currículo com IA.");
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
  async function handleGenerate() {
    // Esta condição impede gerar currículo com texto muito curto.
    if (story.trim().length < 20) {
      // Esta linha mostra uma orientação amigável para o usuário.
      setMessage("Escreva um pouco mais sobre você antes de gerar o currículo.");

      // Este retorno encerra a função porque falta informação.
      return;
    }

    // Esta condição evita enviar duas requisições para a IA se o usuário clicar várias vezes.
    if (isGenerating) {
      // Este retorno mantém a chamada atual em andamento.
      return;
    }

    // Esta linha mostra que o sistema está falando com a rota segura da IA.
    setMessage("Gerando currículo profissional com IA...");

    // Esta linha bloqueia novo envio enquanto a IA processa o relato.
    setIsGenerating(true);

    // Este bloco tenta usar a IA e, se algo falhar, usa a geração local básica.
    try {
      // Esta linha chama a API interna, que usa OPENAI_API_KEY apenas no servidor.
      const aiResume = await requestAiResume(story.trim());

      // Esta linha salva o currículo profissional devolvido pela IA.
      setResume(aiResume);

      // Esta linha confirma que a pré-visualização foi criada com IA.
      setMessage("Currículo gerado com IA. Revise o modelo antes de baixar.");
    } catch (error) {
      // Esta linha registra o erro no console para investigação, sem mostrar detalhes técnicos ao usuário.
      console.error("Falha ao gerar currículo com IA:", error);

      // Esta constante cria uma versão básica para o jovem não ficar sem retorno.
      const fallbackResume = createResumeFromStory(story.trim());

      // Esta linha salva a versão básica no mesmo formato dos templates.
      setResume(fallbackResume);

      // Esta mensagem explica o problema de forma simples e mantém a experiência funcionando.
      setMessage(
        "Não foi possível usar a IA agora. Geramos uma versão básica para você revisar.",
      );
    } finally {
      // Esta linha libera o botão depois da tentativa de geração.
      setIsGenerating(false);

      // Esta linha abre a segunda etapa com o currículo gerado pela IA ou pelo fallback local.
      setStep("preview");
    }
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
                  isGenerating={isGenerating}
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
