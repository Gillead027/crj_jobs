"use client";

// Este arquivo mostra a pergunta simples depois que o curriculo e baixado.
// A resposta fica somente no LocalStorage e nao envia dados pessoais para servidor.
import { ThumbsUp } from "lucide-react";

// Este import traz a funcao que salva o feedback local com cuidado de privacidade.
import { saveDownloadFeedback } from "@/lib/resume-feedback";

// Este import traz os tipos usados pelo componente de feedback.
import type {
  DownloadFeedbackProps,
  ResumeDownloadFeedbackAnswer,
} from "@/types/resume";

// Este componente pergunta se o curriculo ficou bom depois de baixar.
export function DownloadFeedback({
  // Esta propriedade informa se a pergunta deve aparecer.
  isVisible,

  // Esta propriedade informa qual formato acabou de ser baixado.
  downloadFormat,

  // Esta propriedade avisa a pagina quando a resposta foi salva localmente.
  onFeedbackSaved,
}: DownloadFeedbackProps) {
  // Esta condicao evita ocupar espaco quando ainda nao houve download.
  if (!isVisible) {
    // Este retorno remove o bloco visual ate o primeiro download.
    return null;
  }

  // Esta funcao salva uma resposta simples sem incluir curriculo ou contato.
  function handleFeedback(answer: ResumeDownloadFeedbackAnswer) {
    // Esta linha grava apenas a opiniao no navegador atual.
    saveDownloadFeedback(answer, downloadFormat);

    // Esta linha entrega a resposta para a pagina esconder a pergunta e mostrar confirmacao.
    onFeedbackSaved(answer);
  }

  // Este retorno monta a pergunta com botoes acessiveis por teclado.
  return (
    <section
      className="w-full max-w-full overflow-hidden rounded-lg border border-teal-100 bg-white/90 p-4 shadow-lg shadow-slate-200/50"
      aria-labelledby="download-feedback-title"
    >
      {/* Este bloco organiza o icone e a pergunta principal. */}
      <div className="flex min-w-0 items-start gap-3">
        {/* Este icone da um sinal visual positivo sem substituir o texto. */}
        <div className="shrink-0 rounded-lg bg-teal-50 p-2 text-teal-700">
          <ThumbsUp className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Este bloco mantem a pergunta e a nota de privacidade juntas. */}
        <div className="min-w-0">
          {/* Este titulo e a pergunta pedida para o feedback simples. */}
          <h2
            id="download-feedback-title"
            className="break-words text-base font-bold text-slate-950"
          >
            Esse currículo ficou bom para você?
          </h2>

          {/* Este texto comenta o cuidado com privacidade de forma clara para equipe e jovens. */}
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            Sua resposta fica apenas neste navegador e não envia dados pessoais.
          </p>
        </div>
      </div>

      {/* Este bloco agrupa as duas respostas simples do feedback. */}
      <div className="mt-4 flex w-full max-w-full flex-col gap-3 sm:flex-row">
        {/* Este botao salva resposta positiva no LocalStorage. */}
        <button
          type="button"
          onClick={() => handleFeedback("good")}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-teal-700 sm:w-auto"
        >
          Sim
        </button>

        {/* Este botao salva resposta de melhoria no LocalStorage. */}
        <button
          type="button"
          onClick={() => handleFeedback("improve")}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-slate-700 sm:w-auto"
        >
          Pode melhorar
        </button>
      </div>
    </section>
  );
}
