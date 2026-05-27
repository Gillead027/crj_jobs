// Este arquivo cria a rota de API que recebe um relato e devolve um currículo em JSON.
// A rota agora usa Gemini no servidor, mantendo a chave fora do navegador.
import {
  GeminiConfigurationError,
  generateResumeWithGemini,
  hasGeminiApiKey,
} from "@/lib/gemini-resume";

// Este import traz os tipos usados para entrada e saída da rota.
import type {
  ResumeApiErrorResponse,
  ResumeApiRequestBody,
  ResumeApiSuccessResponse,
  ResumeGenerationContext,
  ResumeSupplementalAnswers,
} from "@/types/resume";

// Esta linha força a rota a rodar no Node.js, onde GEMINI_API_KEY fica segura no servidor.
// Isso é importante porque a chave da Gemini API nunca deve ir para o navegador do usuário.
export const runtime = "nodejs";

// Esta constante define o tamanho máximo aceito para o relato, evitando requisições grandes demais.
const maxStoryLength = 6000;

// Esta constante define o tamanho máximo de cada resposta complementar para manter a chamada objetiva.
const maxSupplementalAnswerLength = 1200;

// Esta constante lista os campos aceitos nas perguntas inteligentes.
const supplementalAnswerFields: Array<keyof ResumeSupplementalAnswers> = [
  "socialProject",
  "informalWork",
  "digitalSkills",
  "preferredArea",
  "location",
  "contact",
];

// Esta constante cria respostas vazias quando o usuário não responde alguma pergunta opcional.
const emptySupplementalAnswers: ResumeSupplementalAnswers = {
  // Este campo fica vazio se o jovem não citar projeto social, oficina ou curso.
  socialProject: "",

  // Este campo fica vazio se o jovem não citar ajuda ou trabalho informal.
  informalWork: "",

  // Este campo fica vazio se o jovem não citar habilidades digitais.
  digitalSkills: "",

  // Este campo fica vazio se o jovem não escolher área de preferência.
  preferredArea: "",

  // Este campo fica vazio se o jovem não informar bairro ou cidade.
  location: "",

  // Este campo fica vazio se o jovem não informar telefone ou e-mail.
  contact: "",
};

// Esta função cria uma resposta JSON de erro com código HTTP adequado.
function createErrorResponse(status: number, erro: string) {
  // Esta constante garante que o objeto siga o tipo de erro definido para a API.
  const responseBody: ResumeApiErrorResponse = { erro };

  // Esta linha devolve um objeto de erro padronizado para quem chamar a API.
  return Response.json(responseBody, { status });
}

// Esta função verifica se o corpo recebido é um objeto simples.
function isRequestBody(value: unknown): value is ResumeApiRequestBody {
  // Esta linha garante que o valor existe, é objeto e não é uma lista.
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// Esta função extrai o texto livre dos nomes de campo aceitos pela API.
function extractStoryFromBody(body: ResumeApiRequestBody) {
  // Esta constante tenta usar os nomes aceitos em ordem de preferência.
  const possibleStory = body.relato ?? body.texto ?? body.story ?? "";

  // Esta condição garante que apenas texto seja aceito como relato.
  if (typeof possibleStory !== "string") {
    // Este retorno vazio mostra que o campo veio em formato inválido.
    return "";
  }

  // Esta linha remove espaços extras no começo e no fim do relato.
  return possibleStory.trim();
}

// Esta função extrai o modo Primeiro emprego do corpo da requisição.
function extractFirstJobModeFromBody(body: ResumeApiRequestBody) {
  // Esta linha trata qualquer valor diferente de true como modo desligado.
  return body.primeiroEmprego === true;
}

// Esta função limpa uma resposta complementar sem criar ou completar informação.
function cleanSupplementalAnswer(value: unknown) {
  // Esta condição ignora valores que não são texto.
  if (typeof value !== "string") {
    // Este retorno vazio evita passar dados inesperados para a IA.
    return "";
  }

  // Esta linha remove espaços duplicados e limita o tamanho de cada resposta opcional.
  return value.replace(/\s+/g, " ").trim().slice(0, maxSupplementalAnswerLength);
}

// Esta função extrai as perguntas inteligentes no formato que a integração Gemini espera.
function extractSupplementalAnswersFromBody(
  body: ResumeApiRequestBody,
): ResumeSupplementalAnswers {
  // Esta constante começa com todas as respostas vazias para preservar a estrutura.
  const answers: ResumeSupplementalAnswers = { ...emptySupplementalAnswers };

  // Esta constante pega o objeto enviado pela interface, quando ele existir.
  const rawAnswers = body.respostasComplementares;

  // Esta condição ignora respostas complementares em formato inválido.
  if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
    // Este retorno mantém as perguntas opcionais vazias.
    return answers;
  }

  // Este laço copia apenas os campos conhecidos e limpa cada texto antes de chamar a IA.
  supplementalAnswerFields.forEach((field) => {
    // Esta linha salva a resposta limpa no campo correspondente.
    answers[field] = cleanSupplementalAnswer(rawAnswers[field]);
  });

  // Este retorno entrega respostas opcionais seguras para o prompt.
  return answers;
}

// Esta função valida o relato antes de enviar para a Gemini API.
function validateStory(story: string) {
  // Esta condição impede chamada à IA com texto vazio.
  if (!story) {
    // Este retorno explica que o texto livre é obrigatório.
    return "Envie um texto livre no campo relato.";
  }

  // Esta condição evita textos grandes demais para esta rota inicial.
  if (story.length > maxStoryLength) {
    // Este retorno explica o limite de tamanho do relato.
    return `O relato deve ter no máximo ${maxStoryLength} caracteres.`;
  }

  // Este retorno nulo indica que o relato passou na validação.
  return null;
}

// Esta função monta o contexto completo usado pela IA a partir do corpo da requisição.
function buildGenerationContext(body: ResumeApiRequestBody): ResumeGenerationContext {
  // Este retorno junta o modo Primeiro emprego com as perguntas opcionais limpas.
  return {
    firstJobMode: extractFirstJobModeFromBody(body),
    supplementalAnswers: extractSupplementalAnswersFromBody(body),
  };
}

// Esta função responde requisições POST para criar o currículo estruturado.
export async function POST(request: Request) {
  // Esta condição evita chamada externa quando a chave do Gemini não foi configurada.
  // Ela também gera uma mensagem amigável para o sistema em vez de quebrar a aplicação publicamente.
  if (!hasGeminiApiKey()) {
    // Esta resposta explica o problema sem mostrar chave, token ou detalhe sensível para o navegador.
    return createErrorResponse(
      500,
      "O gerador de IA ainda não está configurado. Configure GEMINI_API_KEY no servidor.",
    );
  }

  // Este bloco tenta ler, validar e enviar o relato para a integração Gemini.
  try {
    // Esta linha lê o corpo JSON da requisição.
    const body: unknown = await request.json();

    // Esta condição garante que o corpo seja um objeto.
    if (!isRequestBody(body)) {
      // Esta resposta informa que o formato enviado está errado.
      return createErrorResponse(400, "Envie um JSON com o campo relato.");
    }

    // Esta linha extrai o relato do corpo recebido.
    const story = extractStoryFromBody(body);

    // Esta linha valida o relato antes de chamar a IA.
    const validationError = validateStory(story);

    // Esta condição devolve erro quando o relato está vazio ou grande demais.
    if (validationError) {
      // Esta resposta informa o problema de validação.
      return createErrorResponse(400, validationError);
    }

    // Esta constante guarda modo Primeiro emprego e respostas opcionais complementares.
    const generationContext = buildGenerationContext(body);

    // Esta linha envia o relato e o contexto complementar para o Gemini.
    const curriculo = await generateResumeWithGemini(story, generationContext);

    // Esta constante garante que o objeto siga o tipo de sucesso definido para a API.
    const responseBody: ResumeApiSuccessResponse = { curriculo };

    // Esta linha devolve o currículo em JSON organizado para quem chamou a API.
    return Response.json(responseBody);
  } catch (error) {
    // Esta linha registra apenas um erro técnico genérico para não gravar relato, contato ou currículo em logs.
    console.error("Erro técnico ao gerar currículo com Gemini.");

    // Esta condição trata uma falha de configuração que tenha escapado da checagem inicial.
    if (error instanceof GeminiConfigurationError) {
      // Esta resposta orienta a configurar a variável certa sem expor detalhes sensíveis.
      return createErrorResponse(
        500,
        "O gerador de IA ainda não está configurado. Configure GEMINI_API_KEY no servidor.",
      );
    }

    // Esta resposta evita expor detalhes internos e orienta o usuário a tentar novamente.
    return createErrorResponse(
      500,
      "Não foi possível gerar o currículo com IA. Tente novamente em instantes.",
    );
  }
}
