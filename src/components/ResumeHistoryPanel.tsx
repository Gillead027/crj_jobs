"use client";

// Este arquivo mostra o histórico recente salvo somente no navegador do usuário.
// Ele não consulta servidor: abrir e excluir usam apenas dados do LocalStorage local.
import { Clock3, FileText, Trash2 } from "lucide-react";

// Este import traz os tipos das propriedades e itens do histórico local.
import type { ResumeHistoryItem, ResumeHistoryPanelProps } from "@/types/resume";

// Esta função formata a data local do currículo para exibição curta.
function formatHistoryDate(createdAt: string) {
  // Este bloco evita quebrar a tela se uma data antiga estiver inválida no LocalStorage.
  try {
    // Esta constante transforma o ISO salvo em objeto Date.
    const date = new Date(createdAt);

    // Este retorno usa formato brasileiro simples para o histórico.
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    // Este fallback aparece quando a data local não pode ser formatada.
    return "Data não disponível";
  }
}

// Esta função escolhe um subtítulo curto para cada item salvo.
function getHistorySubtitle(item: ResumeHistoryItem) {
  // Este retorno combina data e template para o jovem reconhecer o currículo salvo.
  return `${formatHistoryDate(item.createdAt)} - ${item.templateId}`;
}

// Este componente renderiza a área "Histórico recente".
export function ResumeHistoryPanel({
  // Esta propriedade traz os currículos salvos localmente no navegador.
  items,

  // Esta propriedade abre um item salvo na pré-visualização.
  onOpen,

  // Esta propriedade remove um item do LocalStorage.
  onDelete,
}: ResumeHistoryPanelProps) {
  // Este retorno monta a área com largura segura para celulares.
  return (
    <section className="w-full max-w-full overflow-hidden rounded-lg border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-5">
      {/* Este cabeçalho explica que o histórico é local neste navegador. */}
      <div className="flex min-w-0 items-start gap-3">
        {/* Este ícone diferencia o histórico da escolha de template. */}
        <div className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-700">
          <Clock3 className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Este bloco mantém título e texto quebrando linha sem estourar no mobile. */}
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-slate-950">
            Histórico recente
          </h2>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            Salvo apenas neste navegador. Nenhum item do histórico é enviado para servidor.
          </p>
        </div>
      </div>

      {/* Esta condição mostra uma mensagem leve quando ainda não há currículos locais. */}
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-600">
          Seus últimos currículos gerados aparecerão aqui.
        </p>
      ) : (
        // Esta lista mostra os currículos salvos localmente para abrir ou excluir.
        <ul className="mt-4 space-y-3">
          {/* Este mapa cria um item visual para cada currículo do LocalStorage. */}
          {items.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              {/* Este bloco mostra nome, data e template usado. */}
              <div className="flex min-w-0 items-start gap-3">
                {/* Este ícone indica que o item representa um currículo. */}
                <FileText className="mt-1 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />

                {/* Este bloco guarda textos com quebra segura. */}
                <div className="min-w-0">
                  <p className="break-words text-sm font-bold text-slate-950">
                    {item.name}
                  </p>
                  <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {getHistorySubtitle(item)}
                  </p>
                </div>
              </div>

              {/* Este bloco agrupa ações locais do histórico. */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                {/* Este botão abre o currículo salvo na pré-visualização. */}
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-teal-700"
                >
                  Abrir
                </button>

                {/* Este botão exclui apenas o item local do navegador. */}
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="inline-flex min-h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 focus-visible:outline-red-700"
                  aria-label={`Excluir ${item.name} do histórico`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
