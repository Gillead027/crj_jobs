// Este arquivo guarda o feedback simples do download apenas no navegador.
// Ele nao envia curriculo, nome, telefone, e-mail ou qualquer dado pessoal para servidor.
import type {
  ResumeDownloadFeedbackAnswer,
  ResumeDownloadFormat,
} from "@/types/resume";

// Esta chave identifica a resposta local salva no LocalStorage deste navegador.
const resumeDownloadFeedbackKey = "crj_resume_download_feedback";

// Este tipo organiza somente dados nao pessoais sobre a opiniao do usuario.
type StoredDownloadFeedback = {
  // Este campo guarda se a pessoa achou o curriculo bom ou se pode melhorar.
  answer: ResumeDownloadFeedbackAnswer;

  // Este campo guarda o formato baixado para entender o contexto local da resposta.
  format: ResumeDownloadFormat;

  // Este campo guarda quando a resposta foi dada, sem identificar a pessoa.
  answeredAt: string;
};

// Esta funcao salva o feedback simples no LocalStorage, mantendo o cuidado de privacidade.
export function saveDownloadFeedback(
  // Este parametro guarda a resposta escolhida no feedback.
  answer: ResumeDownloadFeedbackAnswer,

  // Este parametro guarda se o download que abriu a pergunta foi PDF ou Word.
  format: ResumeDownloadFormat,
) {
  // Esta protecao evita erro quando a funcao for analisada fora do navegador.
  if (typeof window === "undefined") {
    // Este retorno impede qualquer tentativa de acesso ao LocalStorage no servidor.
    return;
  }

  // Esta constante monta apenas um registro anonimo e pequeno.
  const feedback: StoredDownloadFeedback = {
    answer,
    format,
    answeredAt: new Date().toISOString(),
  };

  // Esta linha grava a resposta somente no navegador atual.
  window.localStorage.setItem(resumeDownloadFeedbackKey, JSON.stringify(feedback));
}
