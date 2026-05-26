"use client";

// Este arquivo guarda o formulário moderno onde o jovem escreve seu relato.
import { motion } from "framer-motion";

// Este import traz ícones usados no botão e no cabeçalho do formulário.
import { ArrowRight, PenLine } from "lucide-react";

// Este import traz a barra animada que aparece enquanto a IA gera o currículo.
import { LoadingProgress } from "@/components/LoadingProgress";

// Este import traz tipos do React para eventos de formulário e campo de texto.
import type { ChangeEvent, FormEvent } from "react";

// Este import traz o tipo das propriedades recebidas pelo componente.
import type { ResumeStoryFormProps } from "@/types/resume";

// Este componente mostra a área de escrita e o botão que avança para a pré-visualização.
export function ResumeStoryForm({
  // Esta propriedade guarda o texto digitado pelo jovem.
  story,

  // Esta propriedade atualiza o texto quando o jovem digita.
  onStoryChange,

  // Esta propriedade gera o currículo quando o formulário é enviado.
  onGenerate,

  // Esta propriedade informa se a rota da IA ainda está processando o relato.
  isGenerating,

  // Esta propriedade informa a porcentagem atual da barra de carregamento.
  loadingProgress,

  // Esta propriedade informa se a barra está carregando, concluída ou com erro.
  loadingStatus,

  // Esta propriedade mostra o erro amigável quando a IA não consegue gerar.
  loadingErrorMessage,

  // Esta propriedade mostra mensagens de orientação para o usuário.
  message,
}: ResumeStoryFormProps) {
  // Esta função roda quando o jovem envia o formulário.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Esta linha impede que a página recarregue ao enviar o formulário.
    event.preventDefault();

    // Esta linha chama a função que gera o currículo com IA e muda para a próxima etapa.
    void onGenerate();
  }

  // Esta função roda sempre que o jovem muda o texto do relato.
  function handleStoryChange(event: ChangeEvent<HTMLTextAreaElement>) {
    // Esta linha envia o novo texto para a página principal guardar no estado.
    onStoryChange(event.target.value);
  }

  // Este retorno monta o formulário visual da primeira página.
  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
      className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/60 backdrop-blur"
      onSubmit={handleSubmit}
    >
      {/* Este cabeçalho explica a área de escrita do relato. */}
      <div className="flex items-start gap-3">
        {/* Este bloco cria um fundo suave para o ícone. */}
        <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
          {/* Este ícone mostra que o jovem vai escrever sua história. */}
          <PenLine className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Este bloco guarda o título e o texto de ajuda do formulário. */}
        <div>
          {/* Este título identifica a etapa de escrita. */}
          <h2 className="text-lg font-bold text-slate-950">Conte sua história</h2>

          {/* Este texto orienta sem deixar a tela com cara de formulário burocrático. */}
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Fale sobre você, sua cidade, estudos, cursos, habilidades e experiências,
            mesmo que sejam informais.
          </p>
        </div>
      </div>

      {/* Este bloco guarda o rótulo e a área grande de texto. */}
      <div className="mt-5">
        {/* Este rótulo torna o campo acessível para leitores de tela. */}
        <label htmlFor="story" className="block text-sm font-semibold text-slate-800">
          Relato do jovem
        </label>

        {/* Este campo grande recebe o relato livre do jovem. */}
        <textarea
          id="story"
          name="story"
          rows={10}
          value={story}
          onChange={handleStoryChange}
          disabled={isGenerating}
          className="mt-2 min-h-72 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-900 shadow-inner transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none"
          placeholder="Exemplo: Meu nome é Ana, tenho 17 anos, moro em Recife, busco meu primeiro emprego, estudo o ensino médio, ajudo minha mãe no salão e fiz curso de informática..."
        />
      </div>

      {/* Esta condição troca a mensagem simples pela barra profissional durante a geração. */}
      {loadingStatus !== "idle" ? (
        // Esta barra mostra progresso simulado, mensagens curtas e erro amigável se a IA falhar.
        <LoadingProgress
          progress={loadingProgress}
          status={loadingStatus}
          errorMessage={loadingErrorMessage}
        />
      ) : (
        // Esta área mostra mensagens comuns quando a barra não precisa aparecer.
        <p className="mt-3 min-h-6 text-sm font-medium text-slate-700" aria-live="polite">
          {/* Este texto muda quando o usuário tenta gerar o currículo. */}
          {message}
        </p>
      )}

      {/* Este bloco organiza o botão principal no fim do formulário. */}
      <div className="mt-5 flex justify-end">
        {/* Este botão gera o currículo e abre a tela de pré-visualização. */}
        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/70 transition hover:bg-teal-800 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:shadow-none sm:w-auto"
        >
          {/* Este texto muda durante a chamada da IA para o usuário saber que deve aguardar. */}
          {isGenerating ? "Gerando currículo..." : "Gerar currículo"}

          {/* Este ícone indica avanço para a próxima etapa. */}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.form>
  );
}
