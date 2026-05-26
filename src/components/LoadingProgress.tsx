"use client";

// Este arquivo cria a barra de progresso exibida enquanto a IA gera o currículo.
import { motion } from "framer-motion";

// Este import traz ícones simples para mostrar carregamento, sucesso e erro.
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

// Este import traz o tipo das propriedades recebidas pelo componente.
import type { LoadingProgressProps } from "@/types/resume";

// Esta lista guarda as mensagens curtas que aparecem durante o carregamento.
const progressMessages = [
  // Esta mensagem aparece no começo, quando o sistema começa a ler o relato.
  { minimumProgress: 0, text: "Lendo sua história..." },

  // Esta mensagem aparece quando a IA começa a transformar atividades em experiências.
  { minimumProgress: 25, text: "Organizando suas experiências..." },

  // Esta mensagem aparece quando o sistema valoriza habilidades citadas no relato.
  { minimumProgress: 50, text: "Valorizando suas habilidades..." },

  // Esta mensagem aparece na parte final antes da pré-visualização.
  { minimumProgress: 75, text: "Montando seu currículo profissional..." },
] as const;

// Esta função escolhe qual mensagem deve aparecer conforme a porcentagem da barra.
function getProgressMessage(progress: number) {
  // Esta linha pega a última mensagem compatível com o progresso atual.
  const currentMessage = progressMessages
    .filter((message) => progress >= message.minimumProgress)
    .at(-1);

  // Este retorno usa a primeira mensagem como segurança caso o progresso venha vazio.
  return currentMessage?.text ?? progressMessages[0].text;
}

// Esta função limita o progresso entre 0 e 100 para evitar valores visuais inválidos.
function clampProgress(progress: number) {
  // Esta linha garante que a barra nunca passe de 100 e nunca fique menor que 0.
  return Math.min(100, Math.max(0, progress));
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
      className={`mt-4 rounded-lg border p-4 shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-teal-100 bg-teal-50/80 text-slate-800"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Este bloco organiza ícone, mensagem e porcentagem em uma linha responsiva. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Este bloco mostra o ícone e a mensagem atual do carregamento. */}
        <div className="flex items-center gap-3">
          {/* Este fundo destaca o ícone sem deixar o carregamento pesado. */}
          <div
            className={`rounded-lg p-2 ${
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
          <p className="text-sm font-bold">{message}</p>
        </div>

        {/* Esta porcentagem ajuda o usuário a perceber que algo está avançando. */}
        <span className="text-sm font-black tabular-nums">
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

      {/* Este texto final mantém a experiência simples, sem explicar detalhes técnicos ao usuário. */}
      {!isError ? (
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Aguarde alguns instantes.
        </p>
      ) : (
        <p className="mt-3 text-xs leading-5 text-red-700">
          Revise o relato ou tente novamente em instantes.
        </p>
      )}
    </motion.div>
  );
}
