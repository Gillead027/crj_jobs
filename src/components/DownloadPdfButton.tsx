"use client";

// Este arquivo guarda o componente do botão que baixa o currículo em PDF.
import { Download } from "lucide-react";

// Este import traz a função que cria o arquivo PDF.
import { downloadResumePdf } from "@/lib/resume-pdf";

// Este import traz o tipo das propriedades recebidas pelo botão.
import type { DownloadPdfButtonProps } from "@/types/resume";

// Este componente mostra o botão "Baixar currículo" e controla o clique de download.
export function DownloadPdfButton({
  // Esta propriedade traz os dados do currículo que serão colocados no PDF.
  resume,

  // Esta propriedade informa se o currículo já foi gerado.
  canDownload,

  // Esta propriedade informa qual template deve ser usado no PDF.
  templateId,

  // Esta propriedade permite mostrar mensagens para o usuário.
  onStatusChange,

  // Esta propriedade avisa a pagina que o download terminou para abrir o feedback local.
  onDownloaded,
}: DownloadPdfButtonProps) {
  // Esta função roda quando o usuário clica no botão de download.
  async function handleDownload() {
    // Esta condição evita baixar PDF antes de gerar o currículo.
    if (!canDownload) {
      // Esta mensagem explica qual passo falta.
      onStatusChange("Gere o currículo antes de baixar o PDF.");

      // Este retorno encerra a função porque ainda não existe currículo gerado.
      return;
    }

    // Esta mensagem informa que o sistema começou a preparar o arquivo.
    onStatusChange("Preparando o PDF para download.");

    // Este bloco tenta gerar o PDF e também trata erro caso algo falhe.
    try {
      // Esta linha chama a função que monta e salva o PDF no template escolhido.
      await downloadResumePdf(resume, templateId);

      // Esta mensagem confirma que o arquivo foi enviado para download.
      onStatusChange("PDF gerado. Verifique os downloads do navegador.");

      // Esta linha avisa a pagina para mostrar a pergunta simples de feedback.
      onDownloaded?.("pdf");
    } catch {
      // Esta mensagem orienta o usuário caso o navegador não consiga gerar o PDF.
      onStatusChange("Não foi possível gerar o PDF. Tente novamente.");
    }
  }

  // Este retorno monta o botão de download separado do formulário.
  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Baixar currículo em PDF"
      className="inline-flex min-h-12 w-full max-w-full items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50 px-5 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline-emerald-700 sm:w-auto"
    >
      {/* Este ícone indica visualmente que o botão faz download. */}
      <Download className="h-4 w-4 shrink-0" aria-hidden="true" />

      {/* Este texto deixa a ação clara para todos os usuários. */}
      <span className="min-w-0 break-words">Baixar currículo em PDF</span>
    </button>
  );
}
