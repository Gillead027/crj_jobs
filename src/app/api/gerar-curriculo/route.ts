// Este arquivo cria a rota de API que recebe um relato e devolve um currículo em JSON.
import OpenAI from "openai";

// Este import traz os tipos usados para entrada e saída da rota.
import type {
  AiResumeJson,
  ResumeApiErrorResponse,
  ResumeApiRequestBody,
  ResumeApiSuccessResponse,
} from "@/types/resume";

// Esta linha força a rota a rodar no Node.js, onde a chave da OpenAI fica segura no servidor.
export const runtime = "nodejs";

// Esta constante define o modelo usado pela rota quando OPENAI_MODEL não estiver configurado.
const defaultModel = "gpt-4o-mini";

// Esta constante define o tamanho máximo aceito para o relato, evitando requisições grandes demais.
const maxStoryLength = 6000;

// Esta constante descreve o formato JSON que a IA deve devolver.
const resumeJsonSchema = {
  // Esta linha informa que o resultado principal deve ser um objeto.
  type: "object",

  // Este bloco lista todos os campos obrigatórios do currículo.
  properties: {
    // Este campo guarda o nome informado pelo jovem.
    nome: { type: "string" },

    // Este campo guarda a idade informada pelo jovem.
    idade: { type: "string" },

    // Este campo guarda o telefone informado pelo jovem.
    telefone: { type: "string" },

    // Este campo guarda o e-mail informado pelo jovem.
    email: { type: "string" },

    // Este campo guarda a cidade informada pelo jovem.
    cidade: { type: "string" },

    // Este campo guarda o objetivo profissional em linguagem profissional.
    objetivoProfissional: { type: "string" },

    // Este campo guarda a formação informada pelo jovem.
    formacao: { type: "string" },

    // Este campo guarda experiências formais ou informais citadas no relato.
    experiencias: {
      // Esta linha informa que experiências devem vir em lista.
      type: "array",

      // Esta linha informa que cada experiência deve ser texto.
      items: { type: "string" },
    },

    // Este campo guarda habilidades citadas ou claramente demonstradas no relato.
    habilidades: {
      // Esta linha informa que habilidades devem vir em lista.
      type: "array",

      // Esta linha informa que cada habilidade deve ser texto.
      items: { type: "string" },
    },

    // Este campo guarda cursos citados no relato.
    cursos: {
      // Esta linha informa que cursos devem vir em lista.
      type: "array",

      // Esta linha informa que cada curso deve ser texto.
      items: { type: "string" },
    },

    // Este campo guarda informações adicionais citadas no relato.
    informacoesAdicionais: {
      // Esta linha informa que informações adicionais devem vir em lista.
      type: "array",

      // Esta linha informa que cada informação adicional deve ser texto.
      items: { type: "string" },
    },
  },

  // Esta lista obriga a IA a devolver todos os campos, mesmo que alguns venham vazios.
  required: [
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
  ],

  // Esta regra impede que a IA acrescente campos fora da estrutura combinada.
  additionalProperties: false,
} as const;

// Esta constante define as instruções principais para a IA.
// O prompt foi reforçado para a IA escrever de forma mais objetiva, moderna e sem resumo.
// Ele também explica como valorizar experiências informais sem criar fatos que o jovem não contou.
const systemPrompt = `
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

// Esta função valida o relato antes de enviar para a IA.
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

// Esta função chama a OpenAI e pede o currículo estruturado.
async function generateResumeWithAi(story: string) {
  // Esta linha cria o cliente da OpenAI usando a variável OPENAI_API_KEY do servidor.
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Esta linha permite trocar o modelo por variável de ambiente sem alterar o código.
  const model = process.env.OPENAI_MODEL ?? defaultModel;

  // Esta chamada envia o relato para a IA e exige uma resposta no schema definido.
  const response = await openai.responses.create({
    // Este campo define qual modelo vai transformar o relato em currículo.
    model,

    // Esta lista envia instruções fixas e o relato real do jovem.
    input: [
      // Esta mensagem define as regras de comportamento da IA.
      { role: "system", content: systemPrompt },

      // Esta mensagem contém o relato livre enviado por quem chamou a API.
      { role: "user", content: `Relato do jovem:\n${story}` },
    ],

    // Este bloco pede Structured Outputs para garantir JSON organizado.
    text: {
      // Este formato obriga a resposta a seguir o JSON Schema do currículo.
      format: {
        // Esta linha ativa saída estruturada por JSON Schema.
        type: "json_schema",

        // Este nome identifica o schema dentro da chamada.
        name: "curriculo_crj",

        // Esta regra pede aderência rigorosa ao schema.
        strict: true,

        // Este objeto contém a estrutura esperada do currículo.
        schema: resumeJsonSchema,
      },
    },
  });

  // Esta condição protege a rota caso a IA não devolva texto final.
  if (!response.output_text) {
    // Este erro será tratado pela função POST e devolvido como falha de API.
    throw new Error("A IA não retornou um texto JSON.");
  }

  // Esta linha converte o texto JSON da IA em objeto JavaScript.
  const curriculo = JSON.parse(response.output_text) as AiResumeJson;

  // Esta linha devolve o currículo limpo, objetivo e sem repetições simples.
  return cleanAiResume(curriculo);
}

// Esta função responde requisições POST para criar o currículo estruturado.
export async function POST(request: Request) {
  // Esta condição evita chamada externa quando a chave da OpenAI não foi configurada.
  if (!process.env.OPENAI_API_KEY) {
    // Esta resposta orienta a configurar a variável de ambiente no servidor.
    return createErrorResponse(500, "Configure a variável OPENAI_API_KEY no servidor.");
  }

  // Este bloco tenta ler e validar o JSON enviado na requisição.
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

    // Esta linha envia o relato para a IA e recebe o currículo estruturado.
    const curriculo = await generateResumeWithAi(story);

    // Esta constante garante que o objeto siga o tipo de sucesso definido para a API.
    const responseBody: ResumeApiSuccessResponse = { curriculo };

    // Esta linha devolve o currículo em JSON organizado para quem chamou a API.
    return Response.json(responseBody);
  } catch (error) {
    // Esta linha registra o erro no servidor para ajudar na investigação técnica.
    console.error("Erro ao gerar currículo com IA:", error);

    // Esta resposta evita expor detalhes internos para o navegador.
    return createErrorResponse(500, "Não foi possível gerar o currículo com IA.");
  }
}
