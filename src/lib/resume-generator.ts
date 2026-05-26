// Este arquivo guarda a lógica que transforma um relato simples em dados de currículo.
import type { ResumeData } from "@/types/resume";

// Esta constante traz um exemplo inicial para ajudar o jovem a entender o que escrever.
export const exampleStory =
  "Meu nome é João, tenho 18 anos, moro em São Paulo, busco meu primeiro emprego, ajudo meu tio na oficina, estudo o ensino médio e sei mexer no Canva.";

// Esta constante define habilidades que o sistema tenta reconhecer dentro do relato.
const knownSkills = [
  // Esta habilidade reconhece jovens que sabem criar artes simples.
  "Canva",

  // Esta habilidade reconhece conhecimento básico de planilhas.
  "Excel",

  // Esta habilidade reconhece conhecimento básico de textos.
  "Word",

  // Esta habilidade reconhece uso geral de computador.
  "Informática",

  // Esta habilidade reconhece facilidade para conversar com pessoas.
  "Atendimento ao público",

  // Esta habilidade reconhece uso profissional de redes sociais.
  "Redes sociais",

  // Esta habilidade reconhece atividades de venda.
  "Vendas",

  // Esta habilidade reconhece boa comunicação.
  "Comunicação",

  // Esta habilidade reconhece organização pessoal.
  "Organização",
] as const;

// Esta função normaliza texto para facilitar buscas sem depender de acentos.
function normalizeText(text: string) {
  // Esta linha remove acentos e deixa tudo em minúsculas para comparar palavras.
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Esta função deixa apenas a primeira letra de uma frase em maiúscula.
function capitalizeSentence(text: string) {
  // Esta linha remove espaços extras para deixar o texto mais limpo.
  const cleanText = text.trim();

  // Esta verificação evita erro quando o texto está vazio.
  if (!cleanText) {
    // Este retorno devolve texto vazio porque não há nada para formatar.
    return "";
  }

  // Esta linha coloca a primeira letra em maiúscula e mantém o restante da frase.
  return cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
}

// Esta função coloca nomes de pessoas ou cidades em formato mais apresentável.
function capitalizeWords(text: string) {
  // Esta linha separa as palavras e arruma a primeira letra de cada uma.
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Esta função separa o relato em pedaços menores para facilitar a extração.
function splitStoryParts(text: string) {
  // Esta linha quebra o texto por pontuação e pelo conector "e".
  return text
    .split(/[,.;]|\se\s/gi)
    .map((piece) => piece.trim())
    .filter(Boolean);
}

// Esta função remove trechos introdutórios para deixar o dado mais limpo.
function removeLeadingExpression(text: string, expression: RegExp) {
  // Esta linha tira frases como "moro em" ou "estudo" do começo do texto.
  return text.replace(expression, "").trim();
}

// Esta função tenta encontrar o nome do jovem dentro do relato.
function extractName(text: string) {
  // Esta expressão procura frases comuns como "meu nome é", "me chamo" ou "sou".
  const nameMatch = text.match(
    /(?:meu nome (?:e|é)|me chamo|sou)\s+([a-zA-ZÀ-ÿ\s]+?)(?:,|\.| tenho| moro| busco| procuro| quero| estudo| telefone| email| e-mail|$)/i,
  );

  // Esta verificação confirma se a expressão encontrou algum nome.
  if (nameMatch?.[1]) {
    // Esta linha devolve o nome formatado sem inventar sobrenome ou outro dado.
    return capitalizeWords(nameMatch[1]);
  }

  // Este retorno vazio mostra que o nome não foi informado de forma clara.
  return "";
}

// Esta função tenta encontrar a idade dentro do relato.
function extractAge(text: string) {
  // Esta expressão procura números seguidos da palavra "anos".
  const ageMatch = text.match(/(\d{1,2})\s*anos/i);

  // Esta linha devolve a idade encontrada ou texto vazio caso ela não exista.
  return ageMatch?.[1] ? `${ageMatch[1]} anos` : "";
}

// Esta função tenta encontrar um telefone dentro do relato.
function extractPhone(text: string) {
  // Esta expressão procura telefones brasileiros com ou sem parênteses, espaço ou traço.
  const phoneMatch = text.match(/(?:\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}/);

  // Esta linha devolve o telefone exatamente como foi encontrado ou vazio se não existir.
  return phoneMatch?.[0]?.trim() ?? "";
}

// Esta função tenta encontrar um e-mail dentro do relato.
function extractEmail(text: string) {
  // Esta expressão procura um padrão comum de e-mail.
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  // Esta linha devolve o e-mail encontrado ou vazio se não existir.
  return emailMatch?.[0]?.trim() ?? "";
}

// Esta função tenta encontrar a cidade dentro do relato.
function extractCity(text: string) {
  // Esta expressão procura formas simples como "moro em", "sou de" ou "resido em".
  const cityMatch = text.match(
    /(?:moro em|sou de|resido em|cidade de)\s+([a-zA-ZÀ-ÿ\s]+?)(?:,|\.| tenho| busco| procuro| quero| estudo| trabalho|$)/i,
  );

  // Esta verificação confirma se a expressão encontrou uma cidade.
  if (cityMatch?.[1]) {
    // Esta linha devolve a cidade formatada sem criar estado ou bairro.
    return capitalizeWords(cityMatch[1]);
  }

  // Este retorno vazio mostra que a cidade não foi informada de forma clara.
  return "";
}

// Esta função cria um objetivo profissional sem inventar meta que o jovem não escreveu.
function buildProfessionalObjective(text: string) {
  // Esta linha cria uma versão normalizada para encontrar palavras importantes.
  const normalizedText = normalizeText(text);

  // Esta condição usa a informação explícita de primeiro emprego quando ela aparece.
  if (normalizedText.includes("primeiro emprego")) {
    // Este retorno cria um cargo/objetivo curto, sem frase explicativa.
    return "Primeiro Emprego";
  }

  // Esta condição usa a informação explícita de estágio quando ela aparece.
  if (normalizedText.includes("estagio")) {
    // Este retorno cria um cargo/objetivo curto, sem frase explicativa.
    return "Estágio";
  }

  // Esta expressão tenta capturar um objetivo escrito com verbos como "busco" ou "quero".
  const objectiveMatch = text.match(
    /(?:busco|procuro|quero|desejo)\s+(.+?)(?:,|\.| e tenho| e estudo| e ajudo|$)/i,
  );

  // Esta verificação usa apenas o objetivo que apareceu no relato.
  if (objectiveMatch?.[1]) {
    // Esta linha remove palavras de apoio para deixar o objetivo com cara de cargo.
    const cleanedObjective = objectiveMatch[1]
      .replace(/^(uma|um|a|o)\s+/i, "")
      .replace(/^(vaga|oportunidade)\s+(de|para)\s+/i, "")
      .trim();

    // Esta linha coloca a frase capturada em formato curto e profissional.
    return capitalizeWords(cleanedObjective);
  }

  // Este retorno vazio evita inventar objetivo quando o jovem não escreveu um.
  return "";
}

// Esta função encontra habilidades que aparecem no relato.
function extractSkills(text: string) {
  // Esta linha cria uma versão sem acentos para comparar palavras com mais facilidade.
  const normalizedText = normalizeText(text);

  // Esta linha filtra a lista de habilidades conhecidas usando o texto do relato.
  const skills = knownSkills.filter((skill) => {
    // Esta linha também remove acentos da habilidade para comparar com o relato.
    const normalizedSkill = normalizeText(skill);

    // Esta linha trata palavras alternativas que indicam atendimento.
    const isCustomerService =
      skill === "Atendimento ao público" &&
      (normalizedText.includes("atendo") ||
        normalizedText.includes("atendimento") ||
        normalizedText.includes("publico"));

    // Esta linha trata palavras alternativas que indicam informática.
    const isComputerSkill =
      skill === "Informática" &&
      (normalizedText.includes("computador") ||
        normalizedText.includes("internet") ||
        normalizedText.includes("informatica"));

    // Esta linha trata palavras alternativas que indicam comunicação.
    const isCommunication =
      skill === "Comunicação" &&
      (normalizedText.includes("comunic") || normalizedText.includes("convers"));

    // Esta linha confirma se a habilidade aparece diretamente ou por palavra parecida.
    return (
      normalizedText.includes(normalizedSkill) ||
      isCustomerService ||
      isComputerSkill ||
      isCommunication
    );
  });

  // Este retorno remove repetições e não cria habilidades que não foram citadas.
  return Array.from(new Set(skills));
}

// Esta função tenta transformar partes do relato em experiências ou atividades.
function extractExperiences(text: string) {
  // Esta linha separa o relato em partes menores para analisar cada uma.
  const pieces = splitStoryParts(text);

  // Esta lista guarda palavras que costumam indicar atividade prática.
  const actionWords = [
    // Esta palavra identifica ajuda em trabalho familiar ou comunitário.
    "ajudo",

    // Esta palavra identifica trabalho formal ou informal.
    "trabalho",

    // Esta palavra identifica cuidado com pessoas, casa ou tarefas.
    "cuido",

    // Esta palavra identifica atividades feitas no dia a dia.
    "faco",

    // Esta palavra identifica a mesma ideia com acento.
    "faço",

    // Esta palavra identifica participação em projetos ou grupos.
    "participo",

    // Esta palavra identifica experiência com vendas.
    "vendo",

    // Esta palavra identifica atendimento.
    "atendo",

    // Esta palavra identifica manutenção, oficina ou conserto.
    "oficina",
  ];

  // Esta linha seleciona apenas partes que parecem falar de alguma atividade.
  const experiences = pieces
    .filter((piece) =>
      actionWords.some((word) => normalizeText(piece).includes(normalizeText(word))),
    )
    .map((piece) => capitalizeSentence(piece));

  // Este retorno remove experiências repetidas e não cria experiência padrão.
  return Array.from(new Set(experiences));
}

// Esta função tenta encontrar a formação escolar ou acadêmica no relato.
function extractEducation(text: string) {
  // Esta linha separa o relato em partes menores para achar trechos de formação.
  const pieces = splitStoryParts(text);

  // Esta lista guarda palavras que costumam indicar formação.
  const educationWords = [
    // Esta palavra identifica ensino fundamental, médio ou superior.
    "ensino",

    // Esta palavra identifica escola.
    "escola",

    // Esta palavra identifica que a pessoa estuda.
    "estudo",

    // Esta palavra identifica faculdade.
    "faculdade",

    // Esta palavra identifica universidade.
    "universidade",

    // Esta palavra identifica formação técnica.
    "técnico",

    // Esta palavra identifica a mesma ideia sem acento.
    "tecnico",

    // Esta palavra identifica conclusão de estudo.
    "completei",
  ];

  // Esta linha encontra partes do relato que falam de formação.
  const educationParts = pieces
    .filter((piece) =>
      educationWords.some((word) => normalizeText(piece).includes(normalizeText(word))),
    )
    .map((piece) =>
      removeLeadingExpression(piece, /^(estudo|estou cursando|completei|terminei)\s+/i),
    )
    .map((piece) => capitalizeSentence(piece));

  // Este retorno junta formações citadas ou devolve vazio quando nada foi informado.
  return Array.from(new Set(educationParts)).join("; ");
}

// Esta função tenta encontrar cursos citados no relato.
function extractCourses(text: string) {
  // Esta linha separa o relato em partes menores para achar cursos.
  const pieces = splitStoryParts(text);

  // Esta lista guarda palavras que costumam indicar curso.
  const courseWords = [
    // Esta palavra identifica cursos livres ou técnicos.
    "curso",

    // Esta palavra identifica certificado informado pelo jovem.
    "certificado",

    // Esta palavra identifica capacitação.
    "capacitação",

    // Esta palavra identifica a mesma ideia sem acento.
    "capacitacao",

    // Esta palavra identifica workshop.
    "workshop",
  ];

  // Esta linha encontra trechos que parecem ser cursos.
  const courses = pieces
    .filter((piece) =>
      courseWords.some((word) => normalizeText(piece).includes(normalizeText(word))),
    )
    .map((piece) =>
      removeLeadingExpression(piece, /^(fiz|tenho|conclui|completei)\s+/i),
    )
    .map((piece) => capitalizeSentence(piece));

  // Este retorno remove cursos repetidos e não cria cursos não informados.
  return Array.from(new Set(courses));
}

// Esta função tenta encontrar informações adicionais no relato.
function extractAdditionalInfo(text: string) {
  // Esta linha separa o relato em partes menores para achar informações extras.
  const pieces = splitStoryParts(text);

  // Esta lista guarda palavras que costumam indicar informações adicionais.
  const additionalWords = [
    // Esta palavra identifica disponibilidade de horário ou início.
    "disponibilidade",

    // Esta palavra identifica carteira de habilitação.
    "cnh",

    // Esta expressão identifica carteira de motorista.
    "carteira de motorista",

    // Esta palavra identifica trabalho voluntário.
    "voluntário",

    // Esta palavra identifica a mesma ideia sem acento.
    "voluntario",

    // Esta palavra identifica turno disponível.
    "turno",

    // Esta palavra identifica horário disponível.
    "horário",

    // Esta palavra identifica a mesma ideia sem acento.
    "horario",
  ];

  // Esta linha encontra trechos que parecem ser informações adicionais.
  const additionalInfo = pieces
    .filter((piece) =>
      additionalWords.some((word) => normalizeText(piece).includes(normalizeText(word))),
    )
    .map((piece) => capitalizeSentence(piece));

  // Este retorno remove informações repetidas e não cria dados extras.
  return Array.from(new Set(additionalInfo));
}

// Esta função principal transforma o relato em dados de currículo.
export function createResumeFromStory(story: string): ResumeData {
  // Esta linha guarda uma versão limpa do relato digitado.
  const cleanStory = story.trim();

  // Este retorno monta os dados objetivos do currículo sem seção de resumo.
  return {
    // Este campo mostra o nome no topo do currículo.
    name: extractName(cleanStory),

    // Este campo mostra a idade quando ela existe.
    age: extractAge(cleanStory),

    // Este campo mostra o telefone quando ele existe no relato.
    phone: extractPhone(cleanStory),

    // Este campo mostra o e-mail quando ele existe no relato.
    email: extractEmail(cleanStory),

    // Este campo mostra a cidade quando ela existe no relato.
    city: extractCity(cleanStory),

    // Este campo mostra o objetivo quando ele foi escrito ou indicado pelo jovem.
    professionalObjective: buildProfessionalObjective(cleanStory),

    // Este campo mostra a formação quando ela foi citada.
    education: extractEducation(cleanStory),

    // Este campo mostra experiências e atividades percebidas no relato.
    experiences: extractExperiences(cleanStory),

    // Este campo mostra habilidades reconhecidas no relato.
    skills: extractSkills(cleanStory),

    // Este campo mostra cursos citados no relato.
    courses: extractCourses(cleanStory),

    // Este campo mostra informações adicionais citadas no relato.
    additionalInfo: extractAdditionalInfo(cleanStory),
  };
}
