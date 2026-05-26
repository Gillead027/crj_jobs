// Este arquivo guarda os tipos TypeScript usados pelo currículo.

// Este tipo organiza todos os dados que aparecem no currículo profissional.
export type ResumeData = {
  // Este campo guarda o nome identificado no relato do jovem.
  name: string;

  // Este campo guarda a idade identificada no relato, quando ela existir.
  age: string;

  // Este campo guarda o telefone identificado no relato, quando ele existir.
  phone: string;

  // Este campo guarda o e-mail identificado no relato, quando ele existir.
  email: string;

  // Este campo guarda a cidade identificada no relato, quando ela existir.
  city: string;

  // Este campo guarda o objetivo profissional informado ou percebido no relato.
  professionalObjective: string;

  // Este campo guarda a formação escolar ou acadêmica informada no relato.
  education: string;

  // Este campo guarda experiências informais, trabalhos, ajudas ou atividades citadas.
  experiences: string[];

  // Este campo guarda habilidades que aparecem no relato.
  skills: string[];

  // Este campo guarda cursos citados no relato.
  courses: string[];

  // Este campo guarda informações adicionais citadas, como disponibilidade ou CNH.
  additionalInfo: string[];
};

// Este tipo define os modelos visuais que o usuário pode escolher para o currículo.
export type ResumeTemplateId =
  // Este modelo usa estilo premium minimalista, com bege e terracota.
  | "classic-elegant"

  // Este modelo usa estilo corporativo moderno, com contraste forte e azul.
  | "modern-professional"

  // Este modelo usa estilo leve e acolhedor para primeiro emprego.
  | "young-apprentice";

// Este tipo organiza as informações exibidas em cada card de template.
export type ResumeTemplateOption = {
  // Este campo guarda o identificador usado pelo código.
  id: ResumeTemplateId;

  // Este campo guarda o nome visível do template.
  name: string;

  // Este campo guarda uma descrição curta para ajudar na escolha.
  description: string;

  // Este campo guarda classes de cor usadas no card de seleção.
  accentClassName: string;
};

// Este tipo organiza as propriedades que o formulário de relato precisa receber.
export type ResumeStoryFormProps = {
  // Este campo guarda o texto que aparece dentro da área de relato.
  story: string;

  // Esta função avisa a página quando o jovem altera o relato.
  onStoryChange: (nextStory: string) => void;

  // Esta função avisa a página quando o jovem clica para gerar o currículo.
  onGenerate: () => void;

  // Este campo guarda mensagens de orientação, erro ou sucesso.
  message: string;
};

// Este tipo organiza as propriedades que a pré-visualização do currículo precisa receber.
export type ResumePreviewProps = {
  // Este campo guarda os dados prontos que serão exibidos na pré-visualização.
  resume: ResumeData;

  // Este campo informa qual modelo visual deve ser aplicado.
  templateId: ResumeTemplateId;
};

// Este tipo organiza as propriedades que o botão de PDF precisa receber.
export type DownloadPdfButtonProps = {
  // Este campo guarda os dados que serão colocados dentro do PDF.
  resume: ResumeData;

  // Este campo informa se o currículo já foi gerado e pode ser baixado.
  canDownload: boolean;

  // Este campo informa qual estilo visual deve ser usado no PDF.
  templateId: ResumeTemplateId;

  // Esta função permite que o botão mostre mensagens na tela principal.
  onStatusChange: (nextMessage: string) => void;
};

// Este tipo organiza as propriedades recebidas por cada template visual de currículo.
export type ResumeTemplateProps = {
  // Este campo guarda os dados do currículo que o template deve mostrar.
  resume: ResumeData;
};

// Este tipo organiza os formatos de entrada aceitos pela rota de API.
export type ResumeApiRequestBody = {
  // Este campo é o nome principal esperado pela API em português.
  relato?: string;

  // Este campo permite receber o mesmo texto com outro nome comum.
  texto?: string;

  // Este campo permite receber o mesmo texto usando o nome já usado na tela.
  story?: string;
};

// Este tipo organiza o JSON que a IA devolve para a rota de API.
export type AiResumeJson = {
  // Este campo guarda o nome escrito pelo jovem ou fica vazio.
  nome: string;

  // Este campo guarda a idade escrita pelo jovem ou fica vazio.
  idade: string;

  // Este campo guarda o telefone escrito pelo jovem ou fica vazio.
  telefone: string;

  // Este campo guarda o e-mail escrito pelo jovem ou fica vazio.
  email: string;

  // Este campo guarda a cidade escrita pelo jovem ou fica vazio.
  cidade: string;

  // Este campo guarda o objetivo profissional em português brasileiro profissional.
  objetivoProfissional: string;

  // Este campo guarda a formação escrita pelo jovem ou fica vazio.
  formacao: string;

  // Este campo guarda experiências citadas, inclusive experiências informais.
  experiencias: string[];

  // Este campo guarda habilidades citadas ou claramente demonstradas no relato.
  habilidades: string[];

  // Este campo guarda cursos citados pelo jovem.
  cursos: string[];

  // Este campo guarda informações adicionais citadas pelo jovem.
  informacoesAdicionais: string[];
};

// Este tipo organiza a resposta de sucesso da rota de API.
export type ResumeApiSuccessResponse = {
  // Este campo guarda o currículo estruturado que será usado por outras telas ou sistemas.
  curriculo: AiResumeJson;
};

// Este tipo organiza respostas de erro da rota de API.
export type ResumeApiErrorResponse = {
  // Este campo guarda uma mensagem simples para explicar o problema.
  erro: string;
};
