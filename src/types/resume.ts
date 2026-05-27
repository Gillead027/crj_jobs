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

// Este tipo organiza um currículo salvo apenas no LocalStorage do navegador.
export type ResumeHistoryItem = {
  // Este campo identifica o item local para abrir ou excluir depois.
  id: string;

  // Este campo guarda o nome exibido no histórico recente.
  name: string;

  // Este campo guarda a data local em ISO para mostrar quando o currículo foi criado.
  createdAt: string;

  // Este campo guarda o template usado quando o currículo foi salvo.
  templateId: ResumeTemplateId;

  // Este campo guarda todos os dados do currículo salvo no navegador.
  resume: ResumeData;
};

// Este tipo organiza as propriedades da área de histórico recente.
export type ResumeHistoryPanelProps = {
  // Este campo guarda os currículos salvos localmente neste navegador.
  items: ResumeHistoryItem[];

  // Esta função abre um currículo salvo no histórico local.
  onOpen: (item: ResumeHistoryItem) => void;

  // Esta função exclui um currículo do histórico local.
  onDelete: (itemId: string) => void;
};

// Este tipo define os estados visuais da barra de carregamento.
export type LoadingProgressStatus =
  // Este estado significa que a barra ainda não deve aparecer.
  | "idle"

  // Este estado significa que a IA está processando o relato.
  | "loading"

  // Este estado significa que a IA respondeu e a barra deve completar 100%.
  | "success"

  // Este estado significa que a IA falhou e a barra deve parar com mensagem amigável.
  | "error";

// Este tipo organiza as propriedades do componente de barra de progresso.
export type LoadingProgressProps = {
  // Este campo guarda o número atual da barra, de 0 a 100.
  progress: number;

  // Este campo informa se a barra está carregando, completa ou com erro.
  status: LoadingProgressStatus;

  // Este campo guarda a mensagem amigável exibida quando a IA falha.
  errorMessage: string;
};

// Este tipo organiza as respostas opcionais que complementam o relato antes da IA gerar o currículo.
export type ResumeSupplementalAnswers = {
  // Este campo guarda projetos sociais, oficinas ou cursos citados depois do relato inicial.
  socialProject: string;

  // Este campo guarda ajudas e trabalhos informais citados nas perguntas inteligentes.
  informalWork: string;

  // Este campo guarda ferramentas digitais, como celular, computador, Canva, Word, Excel ou redes sociais.
  digitalSkills: string;

  // Este campo guarda a área de preferência do jovem, como atendimento, administrativo ou tecnologia.
  preferredArea: string;

  // Este campo guarda bairro, cidade ou referência de localidade informada nas perguntas.
  location: string;

  // Este campo guarda telefone ou e-mail que o jovem quer colocar no currículo.
  contact: string;
};

// Este tipo organiza todos os dados extras enviados junto com o relato para a IA.
export type ResumeGenerationContext = {
  // Este campo informa se a IA deve adaptar o texto para jovem aprendiz e primeiro emprego.
  firstJobMode: boolean;

  // Este campo guarda respostas opcionais que enriquecem o currículo sem inventar informações.
  supplementalAnswers: ResumeSupplementalAnswers;
};

// Este tipo organiza as propriedades que o formulário de relato precisa receber.
export type ResumeStoryFormProps = {
  // Este campo guarda o texto que aparece dentro da área de relato.
  story: string;

  // Esta função avisa a página quando o jovem altera o relato.
  onStoryChange: (nextStory: string) => void;

  // Este campo informa se o modo Primeiro emprego está marcado.
  firstJobMode: boolean;

  // Esta função liga ou desliga o modo Primeiro emprego na página principal.
  onFirstJobModeChange: (nextValue: boolean) => void;

  // Este campo guarda as respostas opcionais das perguntas inteligentes.
  supplementalAnswers: ResumeSupplementalAnswers;

  // Esta função atualiza uma resposta opcional sem apagar as outras respostas.
  onSupplementalAnswerChange: (
    field: keyof ResumeSupplementalAnswers,
    nextValue: string,
  ) => void;

  // Esta função avisa a página quando o jovem clica para gerar o currículo.
  // Ela pode ser assíncrona porque agora a página chama a rota da IA antes de mostrar a prévia.
  onGenerate: () => void | Promise<void>;

  // Este campo informa se a IA está trabalhando, para bloquear duplo clique e mostrar carregamento.
  isGenerating: boolean;

  // Este campo informa a porcentagem visual da barra de progresso.
  loadingProgress: number;

  // Este campo informa o estado atual da barra de carregamento.
  loadingStatus: LoadingProgressStatus;

  // Este campo guarda uma mensagem amigável quando a IA falha.
  loadingErrorMessage: string;

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

// Este tipo organiza as propriedades do editor aberto depois que o currículo é gerado.
export type ResumeEditorProps = {
  // Este campo traz o currículo atual para preencher os campos editáveis.
  resume: ResumeData;

  // Esta função salva as alterações no estado principal usado pela pré-visualização e pelo PDF.
  onSave: (nextResume: ResumeData) => void;
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

  // Este campo liga o modo Primeiro emprego na rota de IA.
  primeiroEmprego?: boolean;

  // Este campo permite receber as perguntas complementares no formato usado pela interface.
  respostasComplementares?: Partial<ResumeSupplementalAnswers>;
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
