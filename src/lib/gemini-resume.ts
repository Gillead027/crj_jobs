// Este arquivo centraliza a integração com a Gemini API para gerar currículos.
// A troca da IA fica isolada aqui: a rota não precisa conhecer detalhes de endpoint, schema ou resposta do Gemini.
import type { AiResumeJson } from "@/types/resume";

// Esta constante guarda o endpoint REST oficial usado para chamar modelos Gemini pelo servidor.
const geminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta";

// Este modelo padrão é usado quando GEMINI_MODEL não estiver configurado no ambiente.
const defaultGeminiModel = "gemini-3.5-flash";

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

// Este schema usa o formato aceito pela Gemini API para forçar uma resposta em JSON estruturado.
// Ele substitui o schema da integração anterior, mantendo os mesmos campos que a tela já sabe renderizar.
const geminiResumeSchema = {
  type: "OBJECT",
  properties: {
    nome: { type: "STRING" },
    idade: { type: "STRING" },
    telefone: { type: "STRING" },
    email: { type: "STRING" },
    cidade: { type: "STRING" },
    objetivoProfissional: { type: "STRING" },
    formacao: { type: "STRING" },
    experiencias: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    habilidades: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    cursos: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    informacoesAdicionais: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: resumeFieldOrder,
  propertyOrdering: resumeFieldOrder,
} as const;

// Este prompt explica ao Gemini como transformar o relato sem inventar dados do jovem.
// Ele também reforça que o currículo não deve ter seção de resumo.
const systemInstruction = `
Você transforma relatos simples de jovens em currículos profissionais.
Responda sempre em JSON válido seguindo exatamente o schema solicitado.
Use português brasileiro profissional, claro e respeitoso.
Nunca invente experiência, curso, formação, cidade, telefone, e-mail, idade ou nome.
Quando faltar uma informação, use string vazia ou lista vazia.
Valorize experiências informais citadas, como ajudar familiar, cuidar de alguém, vender algo, participar de projeto, trabalho voluntário, oficina, igreja, escola ou comunidade.
Pode melhorar a escrita do que foi citado, mas não pode criar fatos novos.
Habilidades só podem entrar se forem citadas diretamente ou claramente demonstradas pelo relato.
Não crie resumo profissional, seção de resumo ou texto descritivo sobre o relato.
Seja objetivo: use frases curtas, sem parágrafos longos e sem repetir a mesma informação.
Não repita dados de contato, formação, cursos ou habilidades dentro de experiências.
O objetivo profissional deve ser curto, moderno e elegante, com no máximo 5 palavras, como "Jovem Aprendiz Administrativo", "Auxiliar Administrativo" ou "Primeiro Emprego".
As experiências devem ser organizadas em itens profissionais curtos.
Quando o jovem citar uma experiência informal, transforme a atividade em linguagem de currículo e adicione apenas responsabilidades compatíveis com o relato.
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

// Esta função escolhe o modelo Gemini, permitindo troca por variável de ambiente sem mexer no código.
function getGeminiModel() {
  // Esta linha usa GEMINI_MODEL se existir, mas mantém um padrão funcional para produção.
  return process.env.GEMINI_MODEL?.trim() || defaultGeminiModel;
}

// Esta função monta a URL REST do Gemini para o modelo selecionado.
function buildGeminiUrl(model: string) {
  // Esta linha aceita tanto "gemini-..." quanto "models/gemini-..." na variável GEMINI_MODEL.
  const modelName = model.replace(/^models\//, "");

  // Este retorno usa encodeURIComponent para evitar quebra de URL se o nome do modelo tiver caracteres especiais.
  return `${geminiApiBaseUrl}/models/${encodeURIComponent(modelName)}:generateContent`;
}

// Esta função monta o corpo da requisição no formato da Gemini API.
function buildGeminiRequestBody(story: string) {
  // Este retorno envia instrução de sistema, relato do jovem e configuração de JSON estruturado.
  return {
    // Esta instrução fixa substitui a antiga mensagem de sistema da integração anterior.
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },

    // Este conteúdo contém apenas o relato informado pelo jovem.
    contents: [
      {
        role: "user",
        parts: [{ text: `Relato do jovem:\n${story}` }],
      },
    ],

    // Esta configuração obriga o Gemini a responder como JSON seguindo o schema do currículo.
    generationConfig: {
      temperature: 0.2,
      response_mime_type: "application/json",
      response_schema: geminiResumeSchema,
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

// Esta função principal chama a Gemini API e devolve o currículo validado.
export async function generateResumeWithGemini(story: string) {
  // Esta constante pega a chave do Gemini apenas no servidor.
  const apiKey = getGeminiApiKey();

  // Esta constante define o modelo Gemini que será usado nesta chamada.
  const model = getGeminiModel();

  // Esta chamada HTTP usa uma integração direta com Gemini, sem dependência externa de IA.
  const response = await fetch(buildGeminiUrl(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(buildGeminiRequestBody(story)),
  });

  // Esta condição transforma falhas HTTP do Gemini em erro controlado no servidor.
  if (!response.ok) {
    // Esta constante guarda detalhe técnico apenas para log.
    const geminiError = await readGeminiError(response);

    // Este erro não expõe a chave e será convertido em mensagem amigável pela rota.
    throw new Error(`Falha na Gemini API (${response.status}): ${geminiError}`);
  }

  // Esta constante lê a resposta de sucesso da Gemini API.
  const data = (await response.json()) as GeminiGenerateContentResponse;

  // Esta constante extrai o texto JSON do primeiro candidato.
  const rawText = extractGeminiText(data);

  // Esta constante limpa possível markdown externo antes do JSON.parse.
  const jsonText = stripJsonCodeFence(rawText);

  // Esta constante transforma o texto JSON em objeto JavaScript.
  const parsedJson: unknown = JSON.parse(jsonText);

  // Esta condição garante que a resposta ficou no formato estruturado esperado pelo app.
  if (!isAiResumeJson(parsedJson)) {
    // Este erro evita que dados incompletos quebrem a tela ou o PDF.
    throw new Error("A Gemini API retornou um JSON fora do formato esperado.");
  }

  // Este retorno entrega o currículo limpo para a rota responder ao navegador.
  return cleanAiResume(parsedJson);
}
