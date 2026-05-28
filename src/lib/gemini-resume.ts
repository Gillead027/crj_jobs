// Este arquivo centraliza a integração com a Gemini API para gerar currículos.
// A troca da IA fica isolada aqui: a rota não precisa conhecer detalhes de endpoint, schema ou resposta do Gemini.
import type {
  AiResumeJson,
  ResumeGenerationContext,
  ResumeSupplementalAnswers,
} from "@/types/resume";

// Esta constante guarda o endpoint REST oficial usado para chamar modelos Gemini pelo servidor.
const geminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta";

// Este modelo principal precisa existir e estar disponivel na Gemini API usada pelo projeto.
const GEMINI_MODEL = "gemini-2.5-flash";

// Este modelo fallback melhora estabilidade em producao quando o modelo principal fica temporariamente indisponivel.
const GEMINI_FALLBACK_MODEL = "gemini-2.0-flash";

// Esta constante limita retentativas para reduzir impacto de instabilidade temporaria da API Gemini.
const maxGeminiAttempts = 3;

// Esta constante define esperas progressivas antes da segunda e terceira tentativa.
const retryDelaysMs = [1000, 2000] as const;

// Esta lista mantém a ordem dos campos esperados no JSON final do currículo.
const resumeFieldOrder = [
  "nome",
  "idade",
  "telefone",
  "email",
  "cidade",
  "objetivoProfissional",
  "formacao",
  "experiencias",
  "habilidades",
  "cursos",
  "informacoesAdicionais",
] as const;

// Esta constante descreve o formato JSON esperado sem enviar responseSchema para a Gemini.
// O schema foi removido da chamada para evitar erro 400 de compatibilidade na API Gemini.
const expectedJsonFormat = `{
  "nome": "string",
  "idade": "string",
  "telefone": "string",
  "email": "string",
  "cidade": "string",
  "objetivoProfissional": "string",
  "formacao": "string",
  "experiencias": ["string"],
  "habilidades": ["string"],
  "cursos": ["string"],
  "informacoesAdicionais": ["string"]
}`;

// Este prompt explica ao Gemini como transformar o relato sem inventar dados do jovem.
// Ele também reforça que o currículo não deve ter seção de resumo.
const systemInstruction = `
Você transforma relatos simples de jovens em currículos profissionais.
Responda SOMENTE JSON válido, sem markdown, sem comentários e sem texto antes ou depois.
Use exatamente estas chaves, nesta ordem: ${resumeFieldOrder.join(", ")}.
O JSON deve seguir este formato:
${expectedJsonFormat}
Use português brasileiro profissional, claro, respeitoso e natural.
Escreva como um currículo que passaria por uma leitura rápida de RH moderno.
Nunca invente experiência, curso, formação, cidade, telefone, e-mail, idade ou nome.
Quando faltar uma informação, use string vazia ou lista vazia.
Valorize experiências informais citadas, como ajudar familiar, cuidar de alguém, vender algo, participar de projeto, trabalho voluntário, oficina, igreja, escola ou comunidade.
Pode melhorar a escrita do que foi citado, mas não pode criar fatos novos.
Habilidades só podem entrar se forem citadas diretamente ou claramente demonstradas pelo relato.
Não crie resumo profissional, seção de resumo ou texto descritivo sobre o relato.
Seja objetivo: use frases curtas, sem parágrafos longos, sem frases robóticas e sem repetir a mesma informação.
Não repita dados de contato, formação, cursos ou habilidades dentro de experiências.
O objetivo profissional deve ser curto, moderno e elegante, com no máximo 5 palavras, como "Jovem Aprendiz Administrativo", "Auxiliar Administrativo" ou "Primeiro Emprego".
As experiências devem ser organizadas em itens profissionais curtos.
Quando o jovem citar uma experiência informal, transforme a atividade em linguagem de currículo e adicione apenas responsabilidades compatíveis com o relato.
Adapte a linguagem para jovens de diferentes contextos sociais sem usar termos estigmatizantes, julgamentos, rótulos ou explicações sobre vulnerabilidade.
Use escola, projetos sociais, oficinas, cursos, habilidades pessoais, habilidades digitais e experiências informais apenas quando aparecerem no relato ou nas respostas complementares.
Se o relato disser "Ajudo meu tio na oficina", uma boa experiência seria:
experiencias: [
  "Auxílio em oficina mecânica familiar",
  "Organização do ambiente",
  "Apoio nas atividades operacionais",
  "Atendimento básico ao cliente"
]
Nunca use prefixos explicativos como "Objetivo informado", "Experiências citadas", "Habilidades citadas" ou "Formação citada".
Entregue apenas o conteúdo profissional final em cada campo.
`.trim();

// Esta lista traduz as chaves internas das perguntas complementares para textos claros no prompt.
const supplementalAnswerLabels: Record<keyof ResumeSupplementalAnswers, string> = {
  // Este rótulo identifica projetos sociais, oficinas ou cursos citados depois do relato.
  socialProject: "Projeto social, oficina ou curso",

  // Este rótulo identifica trabalhos informais e ajudas em família, escola, igreja ou comércio.
  informalWork: "Ajuda ou trabalho informal",

  // Este rótulo identifica ferramentas digitais informadas pelo jovem.
  digitalSkills: "Habilidades digitais",

  // Este rótulo identifica a área de preferência profissional.
  preferredArea: "Área de preferência",

  // Este rótulo identifica bairro, cidade ou região informada.
  location: "Bairro ou cidade",

  // Este rótulo identifica telefone ou e-mail que deve entrar no currículo.
  contact: "Telefone ou e-mail",
};

// Este tipo descreve a parte de texto que o Gemini devolve dentro de cada candidato.
type GeminiTextPart = {
  // Este campo contém o texto gerado pelo modelo.
  text?: string;
};

// Este tipo descreve a resposta de sucesso da Gemini API no formato usado por esta integração.
type GeminiGenerateContentResponse = {
  // Esta lista contém as respostas candidatas do modelo.
  candidates?: Array<{
    // Este conteúdo guarda as partes de texto da resposta.
    content?: {
      // Estas partes podem vir divididas; por isso a integração junta todas em uma string.
      parts?: GeminiTextPart[];
    };

    // Este campo ajuda a diagnosticar quando o modelo parou antes de concluir.
    finishReason?: string;
  }>;

  // Este bloco aparece quando o prompt é bloqueado antes de gerar candidatos.
  promptFeedback?: {
    // Este campo informa o motivo do bloqueio, quando existir.
    blockReason?: string;
  };
};

// Este tipo descreve um erro HTTP devolvido pelo endpoint do Gemini.
type GeminiErrorResponse = {
  // Este objeto é o padrão de erro das APIs Google.
  error?: {
    // Esta mensagem técnica fica apenas no servidor e não é exibida diretamente ao usuário.
    message?: string;
  };
};

// Este erro específico sinaliza falta de configuração, como GEMINI_API_KEY ausente.
export class GeminiConfigurationError extends Error {
  // Este construtor define um nome claro para facilitar tratamento na rota.
  constructor(message: string) {
    // Esta chamada inicializa a classe Error padrão.
    super(message);

    // Este nome aparece nos logs do servidor quando a configuração estiver faltando.
    this.name = "GeminiConfigurationError";
  }
}

// Este erro especifico sinaliza que a IA respondeu texto que nao virou JSON valido.
export class GeminiInvalidJsonError extends Error {
  // Este construtor define um nome claro para a rota mostrar a mensagem amigavel correta.
  constructor(message: string) {
    // Esta chamada inicializa a classe Error padrao.
    super(message);

    // Este nome aparece nos logs do servidor quando a resposta fugir do formato esperado.
    this.name = "GeminiInvalidJsonError";
  }
}

// Este erro especifico sinaliza instabilidade temporaria da API Gemini depois de todas as tentativas.
export class GeminiTemporaryUnavailableError extends Error {
  // Este construtor define um nome claro para a rota exibir uma mensagem amigavel.
  constructor(message: string) {
    // Esta chamada inicializa a classe Error padrao.
    super(message);

    // Este nome aparece internamente quando 503 persiste mesmo com retry e fallback.
    this.name = "GeminiTemporaryUnavailableError";
  }
}

// Esta função confirma se a chave do Gemini existe sem expor o valor no navegador.
export function hasGeminiApiKey() {
  // Esta linha aceita apenas uma chave com texto real, ignorando espaços vazios.
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

// Esta função recupera a chave do Gemini ou aponta claramente a configuração faltante.
function getGeminiApiKey() {
  // Esta constante lê a variável exigida pelo projeto para autenticar a Gemini API.
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Esta condição evita chamar a IA quando a chave não foi configurada no servidor.
  if (!apiKey) {
    // Este erro será convertido pela rota em uma mensagem amigável para a interface.
    throw new GeminiConfigurationError("Configure GEMINI_API_KEY no servidor.");
  }

  // Este retorno entrega a chave apenas para a chamada server-side.
  return apiKey;
}

// Esta função monta a URL REST do Gemini para o modelo selecionado.
function buildGeminiUrl(model: string) {
  // Esta linha aceita tanto "gemini-..." quanto "models/gemini-..." se o nome do modelo mudar no futuro.
  const modelName = model.replace(/^models\//, "");

  // Este retorno usa encodeURIComponent para evitar quebra de URL se o nome do modelo tiver caracteres especiais.
  return `${geminiApiBaseUrl}/models/${encodeURIComponent(modelName)}:generateContent`;
}

// Esta função monta o texto das respostas complementares para a IA usar como dados informados pelo jovem.
function buildSupplementalAnswersText(answers: ResumeSupplementalAnswers) {
  // Esta constante cria uma linha apenas para respostas realmente preenchidas.
  const answeredQuestions = Object.entries(answers)
    .map(([field, value]) => {
      // Esta constante recupera o rótulo humano da pergunta complementar.
      const label = supplementalAnswerLabels[field as keyof ResumeSupplementalAnswers];

      // Esta constante limpa o valor antes de colocá-lo no prompt.
      const cleanValue = value.trim();

      // Esta condição ignora perguntas vazias para não sugerir dados inexistentes à IA.
      if (!cleanValue) {
        // Este retorno nulo será removido pelo filtro abaixo.
        return null;
      }

      // Este retorno transforma a resposta em uma linha objetiva para o prompt.
      return `- ${label}: ${cleanValue}`;
    })
    .filter(Boolean);

  // Esta condição evita criar contexto falso quando nenhuma pergunta foi respondida.
  if (answeredQuestions.length === 0) {
    // Este retorno deixa claro para a IA que não há dados complementares.
    return "Nenhuma resposta complementar informada.";
  }

  // Este retorno junta as respostas em linhas, preservando o que o jovem escreveu.
  return answeredQuestions.join("\n");
}

// Esta função cria uma instrução adicional quando o usuário marca o modo Primeiro emprego.
function buildFirstJobInstruction(firstJobMode: boolean) {
  // Esta condição mantém o currículo geral quando o modo não está marcado.
  if (!firstJobMode) {
    // Este retorno avisa que não há adaptação especial além das regras gerais.
    return "Modo Primeiro emprego: desativado. Gere um currículo profissional geral com base apenas nos dados informados.";
  }

  // Este retorno explica como o modo Primeiro emprego deve mudar a leitura da IA.
  return `
Modo Primeiro emprego: ativado.
Adapte o currículo para jovem aprendiz, primeiro emprego e pouca experiência.
Valorize escola, projetos sociais, cursos, oficinas, habilidades pessoais, habilidades digitais e experiências informais citadas.
Quando não houver experiência formal, não escreva que a pessoa não tem experiência; apenas organize o que foi informado de forma positiva e objetiva.
Prefira objetivos como "Jovem Aprendiz", "Primeiro Emprego", "Jovem Aprendiz Administrativo" ou área indicada pelo jovem.
`.trim();
}

// Esta função monta o texto do usuário com relato, modo Primeiro emprego e perguntas complementares.
function buildUserPrompt(story: string, context: ResumeGenerationContext) {
  // Esta constante transforma as respostas opcionais em linhas legíveis para o Gemini.
  const supplementalAnswersText = buildSupplementalAnswersText(
    context.supplementalAnswers,
  );

  // Esta constante cria a regra específica do modo Primeiro emprego.
  const firstJobInstruction = buildFirstJobInstruction(context.firstJobMode);

  // Este retorno separa relato e complementos para a IA entender a origem de cada dado.
  return `
Relato principal do jovem:
${story}

${firstJobInstruction}

Respostas complementares opcionais:
${supplementalAnswersText}

Use o relato principal e as respostas complementares como informações fornecidas pelo jovem.
Não preencha campos com suposições.
`.trim();
}

// Esta função monta o corpo da requisição no formato da Gemini API.
function buildGeminiRequestBody(story: string, context: ResumeGenerationContext) {
  // Este retorno envia apenas prompt e generationConfig simples para evitar erro 400 de compatibilidade.
  return {
    // Este conteúdo contém as instruções e o relato informado pelo jovem em um único prompt.
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\n${buildUserPrompt(story, context)}` }],
      },
    ],

    // Esta configuração simples pede JSON sem enviar responseSchema, tools ou function calling.
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };
}

// Esta função lê o corpo de erro da Gemini API sem derrubar a rota se o erro vier em formato inesperado.
async function readGeminiError(response: Response) {
  // Este bloco tenta interpretar o erro como JSON padrão das APIs Google.
  try {
    // Esta linha lê o JSON devolvido pelo Gemini quando a chamada HTTP falha.
    const data = (await response.json()) as GeminiErrorResponse;

    // Este retorno entrega a mensagem técnica apenas para logs internos.
    return data.error?.message ?? response.statusText;
  } catch {
    // Este fallback cobre erros sem JSON no corpo da resposta.
    return response.statusText;
  }
}

// Esta funcao registra apenas status, modelo usado e tentativa, sem relato, contato, email ou curriculo.
function logGeminiHttpError(status: number, model: string, attempt: number) {
  // Este log seguro ajuda diagnostico em producao sem expor dados pessoais.
  console.error({
    status,
    model,
    attempt,
  });
}

// Esta funcao espera entre tentativas para dar tempo de a instabilidade temporaria da API passar.
function wait(milliseconds: number) {
  // Este retorno cria uma pausa controlada antes de repetir uma chamada com erro 503.
  return new Promise((resolve) => {
    // Esta linha agenda a proxima tentativa sem bloquear o servidor.
    setTimeout(resolve, milliseconds);
  });
}

// Esta função extrai o texto JSON da resposta do Gemini.
function extractGeminiText(response: GeminiGenerateContentResponse) {
  // Esta condição trata bloqueio do prompt antes de qualquer candidato ser gerado.
  if (response.promptFeedback?.blockReason) {
    // Este erro evita tentar parsear uma resposta inexistente.
    throw new Error(`Prompt bloqueado pelo Gemini: ${response.promptFeedback.blockReason}`);
  }

  // Esta constante junta todas as partes de texto do primeiro candidato.
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  // Esta condição protege a rota quando o Gemini não devolve texto final.
  if (!text) {
    // Este erro será logado no servidor e convertido em mensagem amigável.
    throw new Error("A Gemini API não retornou um JSON de currículo.");
  }

  // Este retorno entrega o texto bruto para parsear como JSON.
  return text;
}

// Esta função remove cercas de código caso o modelo devolva markdown apesar do modo JSON.
function stripJsonCodeFence(text: string) {
  // Esta linha remove apenas marcadores externos, preservando o JSON interno.
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

// Esta função faz o JSON.parse com tratamento específico para resposta fora do formato.
function parseGeminiJson(jsonText: string) {
  // Este bloco separa erro de parse do restante das falhas técnicas.
  try {
    // Esta linha transforma o texto JSON em objeto JavaScript.
    return JSON.parse(jsonText) as unknown;
  } catch {
    // Este erro vira uma mensagem amigável na rota, sem registrar o conteúdo gerado.
    throw new GeminiInvalidJsonError("A Gemini respondeu fora do formato JSON esperado.");
  }
}

// Esta função confirma se um valor desconhecido é uma lista de textos.
function isStringArray(value: unknown): value is string[] {
  // Esta linha exige array e todos os itens como string.
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

// Esta função valida o JSON parseado antes de usar os campos no currículo.
function isAiResumeJson(value: unknown): value is AiResumeJson {
  // Esta condição garante que o valor é um objeto comum.
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    // Este retorno sinaliza formato inválido.
    return false;
  }

  // Esta constante facilita acessar campos de um objeto desconhecido.
  const candidate = value as Record<string, unknown>;

  // Este retorno valida cada campo exigido pelo currículo estruturado.
  return (
    typeof candidate.nome === "string" &&
    typeof candidate.idade === "string" &&
    typeof candidate.telefone === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.cidade === "string" &&
    typeof candidate.objetivoProfissional === "string" &&
    typeof candidate.formacao === "string" &&
    isStringArray(candidate.experiencias) &&
    isStringArray(candidate.habilidades) &&
    isStringArray(candidate.cursos) &&
    isStringArray(candidate.informacoesAdicionais)
  );
}

// Esta função normaliza texto para comparar itens sem depender de maiúsculas, minúsculas ou acentos.
function normalizeForComparison(text: string) {
  // Esta linha remove acentos, deixa tudo em minúsculas e tira espaços extras para achar repetições.
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Esta função limpa um texto curto devolvido pela IA sem mudar o sentido do que foi escrito.
function cleanTextItem(text: string) {
  // Esta linha remove espaços extras para deixar os campos mais profissionais.
  return text.replace(/\s+/g, " ").trim();
}

// Esta função remove itens vazios e repetidos de uma lista devolvida pela IA.
function cleanUniqueList(items: string[]) {
  // Esta constante guarda os itens que já apareceram para evitar repetição no currículo.
  const seenItems = new Set<string>();

  // Esta linha percorre cada item, limpa o texto e mantém apenas informações únicas.
  return items.reduce<string[]>((cleanItems, item) => {
    // Esta constante guarda o item sem espaços duplicados.
    const cleanItem = cleanTextItem(item);

    // Esta constante cria uma versão comparável para identificar repetições.
    const comparisonKey = normalizeForComparison(cleanItem);

    // Esta condição ignora textos vazios ou informações que já apareceram na mesma lista.
    if (!cleanItem || seenItems.has(comparisonKey)) {
      // Este retorno mantém a lista como está quando o item não deve entrar.
      return cleanItems;
    }

    // Esta linha marca o item como já usado.
    seenItems.add(comparisonKey);

    // Esta linha adiciona o item limpo à lista final.
    cleanItems.push(cleanItem);

    // Este retorno entrega a lista atualizada para a próxima repetição.
    return cleanItems;
  }, []);
}

// Esta função aplica uma limpeza final no JSON da IA antes de devolver para a tela.
function cleanAiResume(curriculo: AiResumeJson): AiResumeJson {
  // Este retorno mantém a estrutura combinada, mas remove espaços e repetições simples.
  return {
    // Este campo mantém o nome informado, apenas sem espaços extras.
    nome: cleanTextItem(curriculo.nome),

    // Este campo mantém a idade informada, apenas sem espaços extras.
    idade: cleanTextItem(curriculo.idade),

    // Este campo mantém o telefone informado, apenas sem espaços extras.
    telefone: cleanTextItem(curriculo.telefone),

    // Este campo mantém o e-mail informado, apenas sem espaços extras.
    email: cleanTextItem(curriculo.email),

    // Este campo mantém a cidade informada, apenas sem espaços extras.
    cidade: cleanTextItem(curriculo.cidade),

    // Este campo mantém o objetivo curto pedido no prompt, apenas sem espaços extras.
    objetivoProfissional: cleanTextItem(curriculo.objetivoProfissional),

    // Este campo mantém a formação informada, apenas sem espaços extras.
    formacao: cleanTextItem(curriculo.formacao),

    // Esta lista remove experiências vazias ou repetidas, sem criar novas experiências.
    experiencias: cleanUniqueList(curriculo.experiencias),

    // Esta lista remove habilidades vazias ou repetidas, sem criar novas habilidades.
    habilidades: cleanUniqueList(curriculo.habilidades),

    // Esta lista remove cursos vazios ou repetidos, sem criar novos cursos.
    cursos: cleanUniqueList(curriculo.cursos),

    // Esta lista remove informações adicionais vazias ou repetidas.
    informacoesAdicionais: cleanUniqueList(curriculo.informacoesAdicionais),
  };
}

// Esta funcao chama a Gemini com retry e fallback para reduzir falhas por instabilidade temporaria 503.
async function fetchGeminiWithRetryAndFallback(
  // Este parametro traz a chave usada apenas no servidor.
  apiKey: string,

  // Este parametro traz o relato do jovem para montar o prompt.
  story: string,

  // Este parametro traz modo primeiro emprego e respostas opcionais.
  context: ResumeGenerationContext,
) {
  // Esta constante monta o corpo uma vez para manter as tentativas iguais e sem schema complexo.
  const requestBody = JSON.stringify(buildGeminiRequestBody(story, context));

  // Este laco tenta ate 3 vezes no total porque 503 costuma ser instabilidade temporaria da API.
  for (let attempt = 1; attempt <= maxGeminiAttempts; attempt += 1) {
    // Esta constante usa o modelo principal primeiro e o fallback nas repeticoes apos 503.
    const model = attempt === 1 ? GEMINI_MODEL : GEMINI_FALLBACK_MODEL;

    // Esta chamada usa somente texto, modelo e generationConfig simples.
    const response = await fetch(buildGeminiUrl(model), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: requestBody,
    });

    // Esta condicao encerra as tentativas assim que a Gemini responde com sucesso.
    if (response.ok) {
      // Este retorno entrega a resposta de sucesso para o parser JSON.
      return response;
    }

    // Esta linha consome o erro sem registrar relato, telefone, email ou curriculo.
    const geminiError = await readGeminiError(response);

    // Esta linha registra apenas status, modelo usado e tentativa.
    logGeminiHttpError(response.status, model, attempt);

    // Esta condicao nao repete erro 400 porque ele indica requisicao invalida, nao instabilidade temporaria.
    if (response.status === 400) {
      // Este erro segue para a mensagem generica da rota sem novas chamadas.
      throw new Error(`Falha na Gemini API (${response.status}): ${geminiError}`);
    }

    // Esta condicao tambem evita retry em erros que nao sejam 503 temporario.
    if (response.status !== 503) {
      // Este erro segue para tratamento generico, mantendo detalhes fora da interface.
      throw new Error(`Falha na Gemini API (${response.status}): ${geminiError}`);
    }

    // Esta condicao aguarda 1s antes da segunda tentativa e 2s antes da terceira.
    if (attempt < maxGeminiAttempts) {
      // Esta espera melhora estabilidade em producao sem insistir em excesso na API.
      await wait(retryDelaysMs[attempt - 1]);
    }
  }

  // Este erro avisa a rota que todas as tentativas falharam com 503 mesmo usando fallback.
  throw new GeminiTemporaryUnavailableError("Gemini retornou 503 em todas as tentativas.");
}

// Esta função principal chama a Gemini API e devolve o currículo validado.
export async function generateResumeWithGemini(
  story: string,
  context: ResumeGenerationContext,
) {
  // Esta constante pega a chave do Gemini apenas no servidor.
  const apiKey = getGeminiApiKey();

  // Esta chamada usa retry e fallback para melhorar estabilidade em producao contra erro 503.
  const response = await fetchGeminiWithRetryAndFallback(apiKey, story, context);

  // Esta constante lê a resposta de sucesso da Gemini API.
  const data = (await response.json()) as GeminiGenerateContentResponse;

  // Esta constante extrai o texto JSON do primeiro candidato.
  const rawText = extractGeminiText(data);

  // Esta constante limpa possível markdown externo antes do JSON.parse.
  const jsonText = stripJsonCodeFence(rawText);

  // Esta constante transforma o texto JSON em objeto JavaScript com erro amigável se falhar.
  const parsedJson = parseGeminiJson(jsonText);

  // Esta condição garante que a resposta ficou no formato estruturado esperado pelo app.
  if (!isAiResumeJson(parsedJson)) {
    // Este erro evita que dados incompletos quebrem a tela ou o PDF.
    throw new GeminiInvalidJsonError("A Gemini API retornou um JSON fora do formato esperado.");
  }

  // Este retorno entrega o currículo limpo para a rota responder ao navegador.
  return cleanAiResume(parsedJson);
}
