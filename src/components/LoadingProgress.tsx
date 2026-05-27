"use client";

// Este arquivo cria a barra de progresso exibida enquanto a IA gera o currículo.
import { motion } from "framer-motion";

// Este import traz ícones simples para mostrar carregamento, sucesso, etapas e erro.
import { AlertCircle, CheckCircle2, Circle, Sparkles } from "lucide-react";

// Este import traz o tipo das propriedades recebidas pelo componente.
import type { LoadingProgressProps } from "@/types/resume";

// Esta lista guarda as etapas visuais que aparecem durante o carregamento da IA.
const progressSteps = [
  // Esta etapa fica ativa no começo, quando o sistema começa a ler o relato.
  { minimumProgress: 0, completionProgress: 20, text: "Lendo relato" },

  // Esta etapa aparece quando o sistema transforma atividades citadas em experiências.
  { minimumProgress: 20, completionProgress: 45, text: "Organizando experiências" },

  // Esta etapa aparece quando habilidades pessoais e digitais são destacadas.
  { minimumProgress: 45, completionProgress: 68, text: "Valorizando habilidades" },

  // Esta etapa aparece quando o template escolhido está sendo aplicado na experiência visual.
  { minimumProgress: 68, completionProgress: 88, text: "Aplicando template" },

  // Esta etapa aparece no fim, quando a resposta da IA está quase pronta ou concluída.
  { minimumProgress: 88, completionProgress: 100, text: "Finalizando currículo" },
] as const;

// Esta função escolhe qual etapa deve aparecer como mensagem principal conforme a porcentagem da barra.
function getProgressMessage(progress: number) {
  // Esta linha pega a última etapa compatível com o progresso atual.
  const currentMessage = progressSteps
    .filter((step) => progress >= step.minimumProgress)
    .at(-1);

  // Este retorno usa a primeira etapa como segurança caso o progresso venha vazio.
  return currentMessage?.text ?? progressSteps[0].text;
}

// Esta função limita o progresso entre 0 e 100 para evitar valores visuais inválidos.
function clampProgress(progress: number) {
  // Esta linha garante que a barra nunca passe de 100 e nunca fique menor que 0.
  return Math.min(100, Math.max(0, progress));
}

// Esta função define se uma etapa está pendente, ativa ou concluída.
function getStepStatus(
  step: (typeof progressSteps)[number],
  progress: number,
  isComplete: boolean,
) {
  // Esta condição marca tudo como concluído quando a IA já respondeu com sucesso.
  if (isComplete || progress >= step.completionProgress) {
    // Este retorno mostra ícone de check na etapa.
    return "complete";
  }

  // Esta condição identifica a etapa atual pelo intervalo de progresso.
  if (progress >= step.minimumProgress) {
    // Este retorno mostra a etapa em destaque enquanto ela está em andamento.
    return "active";
  }

  // Este retorno deixa etapas futuras em estado discreto.
  return "pending";
}

// Este componente mostra uma barra profissional enquanto o currículo está sendo gerado.
export function LoadingProgress({
  // Esta propriedade informa a porcentagem atual da barra.
  progress,

  // Esta propriedade informa se a barra está carregando, completa ou com erro.
  status,

  // Esta propriedade mostra uma mensagem amigável quando a IA falha.
  errorMessage,
}: LoadingProgressProps) {
  // Esta constante protege o visual contra números fora da faixa esperada.
  const safeProgress = clampProgress(progress);

  // Esta constante define se a barra deve usar aparência de erro.
  const isError = status === "error";

  // Esta constante define se a barra já chegou ao final com sucesso.
  const isComplete = status === "success" || safeProgress >= 100;

  // Esta constante muda a mensagem conforme o progresso, o sucesso ou o erro.
  const message = isError
    ? errorMessage
    : isComplete
      ? "Currículo pronto!"
      : getProgressMessage(safeProgress);

  // Este retorno monta a barra com animação suave usando Framer Motion.
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`mt-4 w-full max-w-full overflow-hidden rounded-lg border p-4 shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-teal-100 bg-teal-50/80 text-slate-800"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Este bloco organiza ícone, mensagem e porcentagem em uma linha responsiva. */}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Este bloco mostra o ícone e a mensagem atual do carregamento. */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Este fundo destaca o ícone sem deixar o carregamento pesado. */}
          <div
            className={`shrink-0 rounded-lg p-2 ${
              isError ? "bg-red-100 text-red-700" : "bg-white text-teal-700"
            }`}
          >
            {/* Este ícone muda quando a IA falha, conclui ou ainda está trabalhando. */}
            {isError ? (
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            ) : isComplete ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            )}
          </div>

          {/* Este texto mostra o que o sistema está fazendo naquele momento. */}
          <p className="min-w-0 break-words text-sm font-bold">{message}</p>
        </div>

        {/* Esta porcentagem ajuda o usuário a perceber que algo está avançando. */}
        <span className="shrink-0 text-sm font-black tabular-nums">
          {Math.round(safeProgress)}%
        </span>
      </div>

      {/* Esta trilha é o fundo da barra de progresso. */}
      <div
        className={`mt-4 h-3 overflow-hidden rounded-full ${
          isError ? "bg-red-100" : "bg-white"
        }`}
        aria-hidden="true"
      >
        {/* Esta parte preenchida cresce suavemente até 90% enquanto a IA responde. */}
        <motion.div
          className={`h-full rounded-full ${
            isError
              ? "bg-red-500"
              : "bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-400"
          }`}
          initial={{ width: "0%" }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>

      {/* Esta lista mostra cada etapa visual e muda para concluída conforme a barra avança. */}
      {!isError ? (
        <ol className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
          {/* Este mapa renderiza as cinco etapas pedidas para o loading. */}
          {progressSteps.map((step) => {
            // Esta constante calcula o estado visual da etapa atual.
            const stepStatus = getStepStatus(step, safeProgress, isComplete);

            // Esta constante indica se a etapa já foi concluída.
            const isStepComplete = stepStatus === "complete";

            // Esta constante indica se a etapa está em andamento.
            const isStepActive = stepStatus === "active";

            // Este retorno monta uma linha compacta e responsiva para a etapa.
            return (
              <li
                key={step.text}
                className={`flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
                  isStepComplete
                    ? "border-teal-200 bg-white text-teal-800"
                    : isStepActive
                      ? "border-amber-200 bg-white text-slate-900"
                      : "border-transparent bg-white/50 text-slate-500"
                }`}
              >
                {/* Este ícone muda para check quando a etapa foi concluída. */}
                {isStepComplete ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Circle
                    className={`h-4 w-4 shrink-0 ${
                      isStepActive ? "fill-amber-300 text-amber-500" : "text-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Este texto mostra o nome da etapa e quebra linha sem estourar o card. */}
                <span className="min-w-0 break-words">{step.text}</span>
              </li>
            );
          })}
        </ol>
      ) : null}

      {/* Este texto final mantém a experiência simples, sem explicar detalhes técnicos ao usuário. */}
      {!isError ? (
        <p className="mt-3 break-words text-xs leading-5 text-slate-600">
          Aguarde alguns instantes.
        </p>
      ) : (
        <p className="mt-3 break-words text-xs leading-5 text-red-700">
          Revise o relato ou tente novamente em instantes.
        </p>
      )}
    </motion.div>
  );
}
