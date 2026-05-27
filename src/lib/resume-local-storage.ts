// Este arquivo guarda funções de LocalStorage para histórico e limite local de geração.
// Tudo aqui roda no navegador: nenhum currículo é salvo em servidor por estas funções.
import type { ResumeData, ResumeHistoryItem, ResumeTemplateId } from "@/types/resume";

// Esta chave identifica a lista dos últimos currículos no LocalStorage do navegador.
const resumeHistoryStorageKey = "crj_jobs_resume_history_v1";

// Esta chave identifica as tentativas recentes de geração no LocalStorage do navegador.
const generationLimitStorageKey = "crj_jobs_generation_attempts_v1";

// Esta constante define quantos currículos recentes ficam salvos no histórico local.
const maxHistoryItems = 5;

// Esta constante define o máximo simples de gerações permitidas por janela de tempo.
const maxGenerationsPerWindow = 5;

// Esta constante define a janela local de limite em milissegundos, aqui 30 minutos.
const generationWindowMs = 30 * 60 * 1000;

// Este tipo organiza o resultado da verificação de limite local.
export type LocalGenerationLimitResult = {
  // Este campo informa se o navegador ainda pode tentar gerar agora.
  allowed: boolean;

  // Este campo guarda quantos milissegundos faltam para liberar nova geração.
  retryAfterMs: number;
};

// Este tipo organiza o resultado de salvar um currículo no histórico.
export type SaveResumeHistoryResult = {
  // Este campo guarda o item salvo ou atualizado.
  item: ResumeHistoryItem;

  // Este campo guarda a lista completa já persistida no LocalStorage.
  history: ResumeHistoryItem[];
};

// Esta função verifica se o código está rodando no navegador antes de usar LocalStorage.
function canUseLocalStorage() {
  // Esta checagem evita erro durante renderização do Next.js fora do navegador.
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// Esta função lê uma lista JSON do LocalStorage com fallback seguro.
function readJsonList<T>(storageKey: string) {
  // Esta condição impede acesso ao LocalStorage quando a função roda fora do navegador.
  if (!canUseLocalStorage()) {
    // Este retorno vazio mantém o app seguro em ambientes sem window.
    return [];
  }

  // Este bloco protege contra JSON inválido ou LocalStorage indisponível.
  try {
    // Esta constante lê o texto cru salvo no navegador.
    const rawValue = window.localStorage.getItem(storageKey);

    // Esta condição trata a ausência de valor como lista vazia.
    if (!rawValue) {
      // Este retorno evita chamar JSON.parse em valor nulo.
      return [];
    }

    // Esta constante tenta converter o texto salvo para JavaScript.
    const parsedValue: unknown = JSON.parse(rawValue);

    // Este retorno só aceita listas, descartando qualquer formato antigo ou quebrado.
    return Array.isArray(parsedValue) ? (parsedValue as T[]) : [];
  } catch {
    // Este retorno evita quebrar a interface se o usuário limpar ou editar o armazenamento local.
    return [];
  }
}

// Esta função escreve uma lista JSON no LocalStorage com fallback silencioso.
function writeJsonList<T>(storageKey: string, items: T[]) {
  // Esta condição impede acesso ao LocalStorage quando a função roda fora do navegador.
  if (!canUseLocalStorage()) {
    // Este retorno encerra sem erro porque não há navegador para salvar.
    return;
  }

  // Este bloco evita que falhas de quota ou bloqueio de armazenamento quebrem o gerador.
  try {
    // Esta linha salva a lista como JSON no navegador atual.
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Esta captura é intencional: histórico local é conveniência e não deve impedir o uso.
  }
}

// Esta função cria um identificador local simples para itens do histórico.
function createLocalId() {
  // Este retorno combina data e aleatório para diferenciar currículos salvos no mesmo navegador.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Esta função escolhe o nome mostrado no histórico sem expor dados extras.
function getHistoryDisplayName(resume: ResumeData) {
  // Esta constante usa o nome do currículo quando ele existir.
  const cleanName = resume.name.trim();

  // Este retorno evita item sem título quando a IA ou edição não preencher nome.
  return cleanName || "Currículo sem nome";
}

// Esta função lê o histórico local de currículos deste navegador.
export function readResumeHistory() {
  // Este retorno busca apenas dados salvos no navegador atual, sem servidor.
  return readJsonList<ResumeHistoryItem>(resumeHistoryStorageKey).slice(
    0,
    maxHistoryItems,
  );
}

// Esta função salva ou atualiza um currículo no histórico local.
export function saveResumeToHistory({
  resume,
  templateId,
  existingItemId,
}: {
  // Este campo guarda os dados que serão salvos no navegador.
  resume: ResumeData;

  // Este campo guarda o template selecionado no momento do salvamento.
  templateId: ResumeTemplateId;

  // Este campo atualiza um item existente quando o currículo veio do histórico.
  existingItemId: string | null;
}): SaveResumeHistoryResult {
  // Esta constante lê o histórico local atual antes de atualizar.
  const currentHistory = readResumeHistory();

  // Esta constante tenta encontrar item existente para preservar a data de criação.
  const existingItem = existingItemId
    ? currentHistory.find((item) => item.id === existingItemId)
    : undefined;

  // Esta constante monta o item novo ou atualizado.
  const nextItem: ResumeHistoryItem = {
    id: existingItem?.id ?? createLocalId(),
    name: getHistoryDisplayName(resume),
    createdAt: existingItem?.createdAt ?? new Date().toISOString(),
    templateId,
    resume,
  };

  // Esta lista coloca o item salvo no topo e remove duplicidade pelo id.
  const nextHistory = [
    nextItem,
    ...currentHistory.filter((item) => item.id !== nextItem.id),
  ].slice(0, maxHistoryItems);

  // Esta linha persiste o histórico apenas no LocalStorage do navegador.
  writeJsonList(resumeHistoryStorageKey, nextHistory);

  // Este retorno entrega o item salvo e a lista atualizada para a tela.
  return { item: nextItem, history: nextHistory };
}

// Esta função remove um currículo do histórico local.
export function deleteResumeFromHistory(itemId: string) {
  // Esta constante remove apenas o id solicitado da lista local.
  const nextHistory = readResumeHistory().filter((item) => item.id !== itemId);

  // Esta linha salva a lista atualizada no navegador, sem chamar servidor.
  writeJsonList(resumeHistoryStorageKey, nextHistory);

  // Este retorno permite atualizar a interface logo após a exclusão.
  return nextHistory;
}

// Esta função remove tentativas antigas da janela de limite local.
function pruneGenerationAttempts(attempts: number[], now: number) {
  // Este retorno mantém apenas tentativas feitas dentro dos últimos 30 minutos.
  return attempts.filter((timestamp) => now - timestamp < generationWindowMs);
}

// Esta função verifica o limite simples de gerações deste navegador.
export function checkLocalGenerationLimit(): LocalGenerationLimitResult {
  // Esta constante guarda o horário atual em milissegundos.
  const now = Date.now();

  // Esta constante lê tentativas antigas salvas apenas neste navegador.
  const recentAttempts = pruneGenerationAttempts(
    readJsonList<number>(generationLimitStorageKey),
    now,
  );

  // Esta linha salva a lista já limpa para não acumular dados antigos no navegador.
  writeJsonList(generationLimitStorageKey, recentAttempts);

  // Esta condição libera geração quando ainda não chegou a 5 tentativas em 30 minutos.
  if (recentAttempts.length < maxGenerationsPerWindow) {
    // Este retorno informa que a chamada pode continuar.
    return { allowed: true, retryAfterMs: 0 };
  }

  // Esta constante encontra a tentativa mais antiga ainda dentro da janela.
  const oldestAttempt = Math.min(...recentAttempts);

  // Esta constante calcula quanto falta para abrir espaço na janela local.
  const retryAfterMs = Math.max(0, generationWindowMs - (now - oldestAttempt));

  // Este retorno bloqueia a chamada com tempo estimado para nova tentativa.
  return { allowed: false, retryAfterMs };
}

// Esta função registra uma tentativa local antes de chamar a IA.
export function recordLocalGenerationAttempt() {
  // Esta constante guarda o horário atual da tentativa.
  const now = Date.now();

  // Esta constante mantém tentativas recentes e adiciona a tentativa atual.
  const nextAttempts = [
    ...pruneGenerationAttempts(readJsonList<number>(generationLimitStorageKey), now),
    now,
  ];

  // Esta linha salva o registro apenas no navegador para reduzir spam simples.
  writeJsonList(generationLimitStorageKey, nextAttempts);
}

// Esta função formata o tempo restante do limite em linguagem amigável.
export function formatRetryAfter(retryAfterMs: number) {
  // Esta constante arredonda para cima para evitar dizer zero minutos quando ainda há bloqueio.
  const minutes = Math.max(1, Math.ceil(retryAfterMs / 60000));

  // Este retorno mostra singular ou plural de forma simples.
  return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
}
