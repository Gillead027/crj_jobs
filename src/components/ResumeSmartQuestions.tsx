"use client";

// Este arquivo guarda o modo Primeiro emprego e as perguntas inteligentes antes da geração final.
// As respostas daqui complementam o relato principal, mas a IA continua proibida de inventar dados.
import { BriefcaseBusiness, HelpCircle } from "lucide-react";

// Este import traz o tipo de evento usado por inputs e textareas controlados.
import type { ChangeEvent } from "react";

// Este import traz o tipo das respostas complementares compartilhado com a página e a API.
import type { ResumeSupplementalAnswers } from "@/types/resume";

// Este tipo organiza as propriedades recebidas pelo componente de perguntas inteligentes.
type ResumeSmartQuestionsProps = {
  // Este campo informa se o modo Primeiro emprego está marcado.
  firstJobMode: boolean;

  // Esta função liga ou desliga o modo Primeiro emprego na página principal.
  onFirstJobModeChange: (nextValue: boolean) => void;

  // Este campo guarda todas as respostas opcionais digitadas pelo jovem.
  supplementalAnswers: ResumeSupplementalAnswers;

  // Esta função atualiza uma resposta específica sem apagar as outras respostas.
  onSupplementalAnswerChange: (
    field: keyof ResumeSupplementalAnswers,
    nextValue: string,
  ) => void;

  // Este campo bloqueia edição enquanto a IA está gerando o currículo.
  disabled: boolean;
};

// Este tipo descreve cada pergunta opcional renderizada pelo componente.
type SmartQuestion = {
  // Este campo conecta a pergunta a uma chave do estado de respostas complementares.
  field: keyof ResumeSupplementalAnswers;

  // Este campo é o texto da pergunta exibida para o jovem.
  label: string;

  // Este campo mostra exemplo curto dentro do campo de resposta.
  placeholder: string;

  // Este campo define se a resposta precisa de uma caixa maior ou de uma linha simples.
  multiline?: boolean;
};

// Esta lista guarda as perguntas inteligentes pedidas para complementar o relato inicial.
const smartQuestions: SmartQuestion[] = [
  {
    field: "socialProject",
    label: "Você já participou de algum projeto social, oficina ou curso?",
    placeholder: "Exemplo: oficina de informática, projeto da escola, curso rápido...",
    multiline: true,
  },
  {
    field: "informalWork",
    label:
      "Você já ajudou alguém em trabalho informal, comércio, cuidado, evento, igreja, escola ou família?",
    placeholder: "Exemplo: ajudei em loja, cuidei de criança, organizei evento...",
    multiline: true,
  },
  {
    field: "digitalSkills",
    label: "Você sabe usar celular, computador, Canva, Word, Excel ou redes sociais?",
    placeholder: "Exemplo: Canva, Word, Instagram, atendimento por WhatsApp...",
    multiline: true,
  },
  {
    field: "preferredArea",
    label:
      "Você prefere trabalhar com atendimento, administrativo, vendas, logística, tecnologia, beleza, alimentação ou outra área?",
    placeholder: "Exemplo: atendimento e administrativo",
  },
  {
    field: "location",
    label: "Qual bairro/cidade você mora?",
    placeholder: "Exemplo: Jardim São Paulo, Recife - PE",
  },
  {
    field: "contact",
    label: "Qual telefone ou e-mail quer colocar?",
    placeholder: "Exemplo: (81) 99999-9999 ou nome@email.com",
  },
];

// Esta classe comum mantém campos responsivos, sem estourar a largura em celulares de 360px.
const fieldClassName =
  "mt-2 w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm transition placeholder:text-slate-400 break-words focus:border-teal-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100";

// Este componente renderiza o botão Primeiro emprego e as perguntas opcionais.
export function ResumeSmartQuestions({
  // Esta propriedade controla se a IA vai adaptar o currículo para primeiro emprego.
  firstJobMode,

  // Esta propriedade avisa a página quando o jovem marca ou desmarca o modo.
  onFirstJobModeChange,

  // Esta propriedade traz as respostas atuais das perguntas opcionais.
  supplementalAnswers,

  // Esta propriedade salva cada resposta no estado principal da página.
  onSupplementalAnswerChange,

  // Esta propriedade impede alterações durante o carregamento da IA.
  disabled,
}: ResumeSmartQuestionsProps) {
  // Esta função alterna o modo Primeiro emprego ao clicar no botão.
  function handleFirstJobToggle() {
    // Esta linha inverte o valor atual e deixa a página enviar esse contexto para a IA.
    onFirstJobModeChange(!firstJobMode);
  }

  // Esta função cria um handler para atualizar a resposta de uma pergunta específica.
  function handleQuestionChange(field: keyof ResumeSupplementalAnswers) {
    // Este retorno funciona tanto para input quanto para textarea.
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Esta linha salva o texto digitado sem mexer no restante do formulário.
      onSupplementalAnswerChange(field, event.target.value);
    };
  }

  // Este retorno monta uma área compacta e responsiva abaixo do relato inicial.
  return (
    <section className="mt-5 w-full max-w-full overflow-hidden rounded-lg border border-teal-100 bg-teal-50/50 p-4">
      {/* Este cabeçalho apresenta o contexto extra que será enviado para a IA. */}
      <div className="flex min-w-0 items-start gap-3">
        {/* Este ícone diferencia visualmente as perguntas do relato livre. */}
        <div className="shrink-0 rounded-lg bg-white p-2 text-teal-700">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Este bloco mantém textos quebrando linha no celular. */}
        <div className="min-w-0">
          <h3 className="break-words text-base font-bold text-slate-950">
            Perguntas rápidas opcionais
          </h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            Responda só o que souber. Esses dados complementam o relato sem substituir sua história.
          </p>
        </div>
      </div>

      {/* Este botão liga a adaptação de primeiro emprego antes do envio para a Gemini API. */}
      <button
        type="button"
        onClick={handleFirstJobToggle}
        disabled={disabled}
        aria-pressed={firstJobMode}
        className={`mt-4 flex w-full max-w-full items-center justify-between gap-3 overflow-hidden rounded-lg border px-4 py-3 text-left text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
          firstJobMode
            ? "border-teal-700 bg-white text-teal-900 shadow-sm"
            : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white"
        }`}
      >
        {/* Este bloco explica visualmente que o modo muda o foco do currículo. */}
        <span className="flex min-w-0 items-center gap-3">
          <BriefcaseBusiness className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">Primeiro emprego</span>
        </span>

        {/* Este texto mostra o estado atual do modo sem depender apenas de cor. */}
        <span className="shrink-0 rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">
          {firstJobMode ? "Ativo" : "Opcional"}
        </span>
      </button>

      {/* Este grid coloca cada pergunta em uma coluna no celular e duas colunas em telas maiores. */}
      <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
        {/* Este mapa cria todos os campos opcionais de forma consistente. */}
        {smartQuestions.map((question) => (
          <label
            key={question.field}
            className={`block min-w-0 text-sm font-semibold text-slate-800 ${
              question.multiline ? "md:col-span-2" : ""
            }`}
          >
            {/* Este texto é a pergunta que ajuda a IA a complementar o currículo. */}
            <span className="break-words">{question.label}</span>

            {/* Esta condição usa textarea para respostas longas e input para respostas curtas. */}
            {question.multiline ? (
              <textarea
                value={supplementalAnswers[question.field]}
                onChange={handleQuestionChange(question.field)}
                disabled={disabled}
                rows={3}
                className={`${fieldClassName} min-h-24 resize-y`}
                placeholder={question.placeholder}
              />
            ) : (
              <input
                type="text"
                value={supplementalAnswers[question.field]}
                onChange={handleQuestionChange(question.field)}
                disabled={disabled}
                className={fieldClassName}
                placeholder={question.placeholder}
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
