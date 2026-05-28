"use client";

// Este arquivo guarda o componente do botao que baixa o curriculo em Word editavel.
import { FileDown } from "lucide-react";

// Este import traz a funcao que cria o arquivo DOCX.
import { downloadResumeDocx } from "@/lib/resume-docx";

// Este import traz o tipo das propriedades recebidas pelo botao.
import type { DownloadDocxButtonProps } from "@/types/resume";

// Este componente mostra o botao "Baixar em Word" e controla o clique de download.
export function DownloadDocxButton({
  // Esta propriedade traz os dados do curriculo que serao colocados no Word.
  resume,

  // Esta propriedade informa se o curriculo ja foi gerado.
  canDownload,

  // Esta propriedade informa qual template orienta as cores discretas do Word.
  templateId,

  // Esta propriedade permite mostrar mensagens para o usuario.
  onStatusChange,

  // Esta propriedade avisa a pagina que o download terminou para abrir o feedback local.
  onDownloaded,
}: DownloadDocxButtonProps) {
  // Esta funcao roda quando o usuario clica no botao de download em Word.
  async function handleDownload() {
    // Esta condicao evita baixar Word antes de gerar o curriculo.
    if (!canDownload) {
      // Esta mensagem explica qual passo falta.
      onStatusChange("Gere o currículo antes de baixar em Word.");

      // Este retorno encerra a funcao porque ainda nao existe curriculo gerado.
      return;
    }

    // Esta mensagem informa que o sistema comecou a preparar o arquivo editavel.
    onStatusChange("Preparando o Word para download.");

    // Este bloco tenta gerar o DOCX e tambem trata erro caso algo falhe.
    try {
      // Esta linha chama a funcao que monta e salva o Word editavel.
      await downloadResumeDocx(resume, templateId);

      // Esta mensagem confirma que o arquivo foi enviado para download.
      onStatusChange("Word gerado. Verifique os downloads do navegador.");

      // Esta linha avisa a pagina para mostrar a pergunta simples de feedback.
      onDownloaded?.("docx");
    } catch {
      // Esta mensagem orienta o usuario caso o navegador nao consiga gerar o Word.
      onStatusChange("Não foi possível gerar o Word. Tente novamente.");
    }
  }

  // Este retorno monta o botao de download separado do formulario.
  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Baixar currículo em Word"
      className="inline-flex min-h-12 w-full max-w-full items-center justify-center gap-2 rounded-lg border border-sky-600 bg-sky-50 px-5 py-3 text-center text-sm font-bold text-sky-800 transition hover:bg-sky-100 focus-visible:outline-sky-700 sm:w-auto"
    >
      {/* Este icone indica visualmente que o botao faz download de arquivo editavel. */}
      <FileDown className="h-4 w-4 shrink-0" aria-hidden="true" />

      {/* Este texto deixa a acao clara para todos os usuarios. */}
      <span className="min-w-0 break-words">Baixar em Word</span>
    </button>
  );
}
