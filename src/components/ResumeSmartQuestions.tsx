"use client";

// Este arquivo guarda o modo Primeiro emprego e as perguntas inteligentes antes da geracao final.
// As respostas daqui complementam o relato principal, mas a IA continua proibida de inventar dados.
import { BriefcaseBusiness, HelpCircle, MapPin, Sparkles } from "lucide-react";

// Este import traz o tipo de evento usado por inputs, selects e textareas controlados.
import type { ChangeEvent } from "react";

// Este import traz o tipo das respostas complementares compartilhado com a pagina e a API.
import type { ResumeSupplementalAnswers } from "@/types/resume";

// Este tipo organiza as propriedades recebidas pelo componente de perguntas inteligentes.
type ResumeSmartQuestionsProps = {
  // Este campo informa se o modo Primeiro emprego esta marcado.
  firstJobMode: boolean;

  // Esta funcao liga ou desliga o modo Primeiro emprego na pagina principal.
  onFirstJobModeChange: (nextValue: boolean) => void;

  // Este campo guarda todas as respostas opcionais digitadas ou selecionadas pelo jovem.
  supplementalAnswers: ResumeSupplementalAnswers;

  // Esta funcao atualiza uma resposta especifica sem apagar as outras respostas.
  onSupplementalAnswerChange: <Field extends keyof ResumeSupplementalAnswers>(
    field: Field,
    nextValue: ResumeSupplementalAnswers[Field],
  ) => void;

  // Este campo bloqueia edicao enquanto a IA esta gerando o curriculo.
  disabled: boolean;
};

// Este tipo descreve cada pergunta de texto que continua livre.
type TextQuestion = {
  // Este campo conecta a pergunta a uma chave textual do estado de respostas complementares.
  field: "socialProject" | "informalWork" | "digitalSkills" | "contact";

  // Este campo e o texto limpo exibido para o jovem.
  label: string;

  // Este campo mostra exemplo curto dentro do campo de resposta.
  placeholder: string;
};

// Esta lista guarda perguntas que continuam em texto porque precisam de relato livre.
const textQuestions: TextQuestion[] = [
  {
    field: "socialProject",
    label: "Projetos, oficinas ou cursos",
    placeholder: "Exemplo: oficina de informatica, curso rapido, projeto da escola",
  },
  {
    field: "informalWork",
    label: "Trabalhos ou ajudas informais",
    placeholder: "Exemplo: ajudei em loja, evento, familia, igreja ou escola",
  },
  {
    field: "digitalSkills",
    label: "Habilidades digitais",
    placeholder: "Exemplo: Canva, Word, Excel, redes sociais, WhatsApp",
  },
  {
    field: "contact",
    label: "Telefone ou e-mail",
    placeholder: "Exemplo: (27) 99999-9999 ou nome@email.com",
  },
];

// Esta lista define os chips de areas de interesse que podem ser marcados juntos.
const areaOptions = [
  "Atendimento ao público",
  "Administrativo",
  "Vendas",
  "Logística",
  "Tecnologia",
  "Beleza/Barbearia",
  "Alimentação",
  "Produção musical/audiovisual",
  "Oficina mecânica",
  "Serviços gerais",
  "Educação/Projetos sociais",
  "Ainda não sei",
  "Outro",
];

// Esta lista comeca pelo Espirito Santo porque o CRJ atua nesse contexto.
const stateOptions = ["Espírito Santo"];

// Este mapa organiza as cidades disponiveis conforme o estado selecionado.
const cityOptionsByState: Record<string, string[]> = {
  // Este estado concentra as cidades iniciais pedidas para o projeto.
  "Espírito Santo": [
    "Vitória",
    "Vila Velha",
    "Cariacica",
    "Serra",
    "Viana",
    "Guarapari",
    "Fundão",
    "Outro",
  ],
};

// Esta classe comum mantem campos responsivos, sem estourar a largura em celulares de 360px.
const fieldClassName =
  "mt-2 w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm transition placeholder:text-slate-400 break-words focus:border-teal-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100";

// Esta classe define chips modernos, clicaveis e acessiveis por teclado.
const chipBaseClassName =
  "min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-bold transition focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-70";

// Este componente renderiza o botao Primeiro emprego e as perguntas opcionais.
export function ResumeSmartQuestions({
  // Esta propriedade controla se a IA vai adaptar o curriculo para primeiro emprego.
  firstJobMode,

  // Esta propriedade avisa a pagina quando o jovem marca ou desmarca o modo.
  onFirstJobModeChange,

  // Esta propriedade traz as respostas atuais das perguntas opcionais.
  supplementalAnswers,

  // Esta propriedade salva cada resposta no estado principal da pagina.
  onSupplementalAnswerChange,

  // Esta propriedade impede alteracoes durante o carregamento da IA.
  disabled,
}: ResumeSmartQuestionsProps) {
  // Esta constante calcula se o campo Outro das areas deve aparecer.
  const isOtherAreaSelected = supplementalAnswers.areasInteresse.includes("Outro");

  // Esta constante pega cidades conforme o estado escolhido.
  const availableCities = cityOptionsByState[supplementalAnswers.estado] ?? [];

  // Esta constante calcula se o campo de cidade manual deve aparecer.
  const isOtherCitySelected = supplementalAnswers.cidade === "Outro";

  // Esta funcao alterna o modo Primeiro emprego ao clicar no botao.
  function handleFirstJobToggle() {
    // Esta linha inverte o valor atual e deixa a pagina enviar esse contexto para a IA.
    onFirstJobModeChange(!firstJobMode);
  }

  // Esta funcao cria um handler para atualizar perguntas de texto livre.
  function handleTextQuestionChange(field: TextQuestion["field"]) {
    // Este retorno funciona para inputs e textareas das perguntas textuais.
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Esta linha salva o texto digitado sem mexer no restante do formulario.
      onSupplementalAnswerChange(field, event.target.value);
    };
  }

  // Esta funcao controla a selecao multipla das areas de interesse.
  function handleAreaToggle(area: string) {
    // Esta condicao impede mudar chips enquanto a IA esta gerando.
    if (disabled) {
      // Este retorno mantem a selecao atual durante o carregamento.
      return;
    }

    // Esta constante verifica se a area ja esta selecionada.
    const isSelected = supplementalAnswers.areasInteresse.includes(area);

    // Esta constante adiciona ou remove a area mantendo a lista organizada.
    const nextAreas = isSelected
      ? supplementalAnswers.areasInteresse.filter((item) => item !== area)
      : [...supplementalAnswers.areasInteresse, area];

    // Esta linha envia a lista de areas para o estado principal que sera enviado para a IA.
    onSupplementalAnswerChange("areasInteresse", nextAreas);

    // Esta condicao limpa o texto do Outro quando a pessoa desmarca esse chip.
    if (area === "Outro" && isSelected) {
      // Esta linha evita enviar area manual antiga quando Outro nao esta selecionado.
      onSupplementalAnswerChange("areaOutro", "");
    }
  }

  // Esta funcao atualiza o texto livre da area Outro.
  function handleOtherAreaChange(event: ChangeEvent<HTMLInputElement>) {
    // Esta linha salva o texto manual que complementa a opcao Outro.
    onSupplementalAnswerChange("areaOutro", event.target.value);
  }

  // Esta funcao atualiza o estado e limpa cidade manual dependente.
  function handleStateChange(event: ChangeEvent<HTMLSelectElement>) {
    // Esta constante guarda o estado escolhido no select.
    const nextState = event.target.value;

    // Esta linha salva o estado organizado que sera enviado para a IA.
    onSupplementalAnswerChange("estado", nextState);

    // Esta linha limpa a cidade quando o estado muda para evitar combinacao errada.
    onSupplementalAnswerChange("cidade", "");

    // Esta linha limpa a cidade manual porque ela depende da selecao de cidade.
    onSupplementalAnswerChange("cidadeOutro", "");
  }

  // Esta funcao atualiza a cidade selecionada conforme o estado.
  function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
    // Esta constante guarda a cidade escolhida no select.
    const nextCity = event.target.value;

    // Esta linha salva a cidade organizada que sera enviada para a IA.
    onSupplementalAnswerChange("cidade", nextCity);

    // Esta condicao limpa o campo manual quando a cidade nao e Outro.
    if (nextCity !== "Outro") {
      // Esta linha evita enviar cidade manual antiga sem necessidade.
      onSupplementalAnswerChange("cidadeOutro", "");
    }
  }

  // Esta funcao atualiza a cidade manual quando a pessoa escolhe Outro.
  function handleOtherCityChange(event: ChangeEvent<HTMLInputElement>) {
    // Esta linha salva a cidade manual sem alterar estado ou bairro.
    onSupplementalAnswerChange("cidadeOutro", event.target.value);
  }

  // Esta funcao atualiza o bairro em texto livre.
  function handleNeighborhoodChange(event: ChangeEvent<HTMLInputElement>) {
    // Esta linha salva o bairro separado para a IA receber localidade organizada.
    onSupplementalAnswerChange("bairro", event.target.value);
  }

  // Este retorno monta uma area compacta e responsiva abaixo do relato inicial.
  return (
    <section className="mt-5 w-full max-w-full overflow-hidden rounded-lg border border-teal-100 bg-teal-50/50 p-4">
      {/* Este cabecalho apresenta o contexto extra que sera enviado para a IA. */}
      <div className="flex min-w-0 items-start gap-3">
        {/* Este icone diferencia visualmente as perguntas do relato livre. */}
        <div className="shrink-0 rounded-lg bg-white p-2 text-teal-700">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Este bloco mantem textos quebrando linha no celular. */}
        <div className="min-w-0">
          <h3 className="break-words text-base font-bold text-slate-950">
            Perguntas rápidas opcionais
          </h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            Responda só o que souber. Esses dados complementam o relato sem substituir sua história.
          </p>
        </div>
      </div>

      {/* Este botao liga a adaptacao de primeiro emprego antes do envio para a Gemini API. */}
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
        {/* Este bloco explica visualmente que o modo muda o foco do curriculo. */}
        <span className="flex min-w-0 items-center gap-3">
          <BriefcaseBusiness className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">Primeiro emprego</span>
        </span>

        {/* Este texto mostra o estado atual do modo sem depender apenas de cor. */}
        <span className="shrink-0 rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">
          {firstJobMode ? "Ativo" : "Opcional"}
        </span>
      </button>

      {/* Este grid coloca perguntas de texto em uma coluna no celular e duas colunas em telas maiores. */}
      <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
        {/* Este mapa cria os campos de texto livre que continuam simples. */}
        {textQuestions.map((question) => (
          <label
            key={question.field}
            className="block min-w-0 text-sm font-semibold text-slate-800 md:col-span-2"
          >
            {/* Este texto usa titulo limpo sem exemplos longos. */}
            <span className="break-words">{question.label}</span>

            {/* Este textarea guarda resposta livre quando a pergunta precisa de contexto. */}
            <textarea
              value={supplementalAnswers[question.field]}
              onChange={handleTextQuestionChange(question.field)}
              disabled={disabled}
              rows={3}
              className={`${fieldClassName} min-h-24 resize-y`}
              placeholder={question.placeholder}
            />
          </label>
        ))}
      </div>

      {/* Este bloco mostra a selecao multipla de areas em chips clicaveis. */}
      <section className="mt-5 rounded-lg border border-white/80 bg-white/75 p-4">
        {/* Este cabecalho explica que varias areas podem ser escolhidas. */}
        <div className="flex min-w-0 items-start gap-3">
          {/* Este icone reforca que a pessoa esta escolhendo interesses. */}
          <div className="shrink-0 rounded-lg bg-teal-50 p-2 text-teal-700">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>

          {/* Este bloco contem o label visual do grupo de chips. */}
          <div className="min-w-0">
            <h4 className="break-words text-sm font-bold text-slate-950">
              Áreas de interesse
            </h4>
            <p className="mt-1 break-words text-sm leading-6 text-slate-600">
              Escolha uma ou mais opções.
            </p>
          </div>
        </div>

        {/* Este grupo de botoes funciona como chips multi-selecao acessiveis por teclado. */}
        <div
          className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Áreas de interesse"
        >
          {/* Este mapa cria um chip para cada area inicial. */}
          {areaOptions.map((area) => {
            // Esta constante identifica se o chip esta ativo.
            const isSelected = supplementalAnswers.areasInteresse.includes(area);

            // Este retorno monta o chip como botao para funcionar bem com teclado.
            return (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaToggle(area)}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Remover" : "Selecionar"} ${area}`}
                className={`${chipBaseClassName} ${
                  isSelected
                    ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>

        {/* Este campo aparece apenas quando o chip Outro esta selecionado. */}
        {isOtherAreaSelected ? (
          <label className="mt-4 block min-w-0 text-sm font-semibold text-slate-800">
            Outra área
            <input
              type="text"
              value={supplementalAnswers.areaOutro}
              onChange={handleOtherAreaChange}
              disabled={disabled}
              className={fieldClassName}
              placeholder="Escreva a área de interesse"
            />
          </label>
        ) : null}
      </section>

      {/* Este bloco organiza estado, cidade e bairro antes de enviar para a IA. */}
      <section className="mt-5 rounded-lg border border-white/80 bg-white/75 p-4">
        {/* Este cabecalho identifica o bloco de localidade. */}
        <div className="flex min-w-0 items-start gap-3">
          {/* Este icone reforca que as perguntas sao de localizacao. */}
          <div className="shrink-0 rounded-lg bg-teal-50 p-2 text-teal-700">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>

          {/* Este bloco contem o titulo limpo pedido. */}
          <div className="min-w-0">
            <h4 className="break-words text-sm font-bold text-slate-950">
              Onde você mora?
            </h4>
            <p className="mt-1 break-words text-sm leading-6 text-slate-600">
              Estado e cidade ajudam a montar um currículo mais completo.
            </p>
          </div>
        </div>

        {/* Este grid mantem estado, cidade e bairro responsivos no celular. */}
        <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-3">
          {/* Este select controla o estado e atualiza a lista de cidades. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Estado
            <select
              value={supplementalAnswers.estado}
              onChange={handleStateChange}
              disabled={disabled}
              className={fieldClassName}
              aria-label="Estado onde mora"
            >
              {/* Este mapa lista os estados disponiveis para o projeto. */}
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          {/* Este select depende do estado escolhido. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Cidade
            <select
              value={supplementalAnswers.cidade}
              onChange={handleCityChange}
              disabled={disabled || availableCities.length === 0}
              className={fieldClassName}
              aria-label="Cidade onde mora"
            >
              <option value="">Selecione</option>
              {/* Este mapa mostra cidades do estado selecionado. */}
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          {/* Este input guarda o bairro em texto livre. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Bairro
            <input
              type="text"
              value={supplementalAnswers.bairro}
              onChange={handleNeighborhoodChange}
              disabled={disabled}
              className={fieldClassName}
              placeholder="Digite o bairro"
            />
          </label>
        </div>

        {/* Este campo aparece apenas quando a cidade escolhida e Outro. */}
        {isOtherCitySelected ? (
          <label className="mt-4 block min-w-0 text-sm font-semibold text-slate-800">
            Outra cidade
            <input
              type="text"
              value={supplementalAnswers.cidadeOutro}
              onChange={handleOtherCityChange}
              disabled={disabled}
              className={fieldClassName}
              placeholder="Escreva a cidade"
            />
          </label>
        ) : null}
      </section>
    </section>
  );
}
