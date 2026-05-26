// Este arquivo guarda a lógica que transforma o currículo em um PDF com o template escolhido.
import type { ResumeData, ResumeTemplateId } from "@/types/resume";

// Este tipo organiza as cores e formas principais de cada PDF.
type PdfTheme = {
  // Este campo guarda a cor de fundo da página.
  page: [number, number, number];

  // Este campo guarda a cor principal dos títulos.
  accent: [number, number, number];

  // Este campo guarda a cor principal do texto.
  text: [number, number, number];

  // Este campo guarda a cor secundária do texto.
  muted: [number, number, number];

  // Este campo guarda a cor do fundo da coluna lateral.
  sidebar: [number, number, number];

  // Este campo guarda a cor do cabeçalho quando o template usa cabeçalho colorido.
  header?: [number, number, number];
};

// Este tipo organiza uma seção do PDF.
type PdfSection = {
  // Este campo guarda o título da seção.
  title: string;

  // Este campo guarda o texto da seção quando ela não usa lista.
  text?: string;

  // Este campo guarda os itens da seção quando ela usa lista.
  items?: string[];

  // Este campo guarda a orientação quando a seção está vazia.
  emptyText: string;
};

// Esta função escolhe as cores do PDF de acordo com o template selecionado.
function getPdfTheme(templateId: ResumeTemplateId): PdfTheme {
  // Esta condição cria o tema corporativo moderno.
  if (templateId === "modern-professional") {
    // Este retorno usa cabeçalho escuro e detalhes azuis.
    return {
      page: [255, 255, 255],
      accent: [3, 105, 161],
      text: [15, 23, 42],
      muted: [71, 85, 105],
      sidebar: [241, 245, 249],
      header: [15, 23, 42],
    };
  }

  // Esta condição cria o tema jovem aprendiz.
  if (templateId === "young-apprentice") {
    // Este retorno usa verde e azul suave para um visual leve.
    return {
      page: [255, 255, 255],
      accent: [4, 120, 87],
      text: [15, 23, 42],
      muted: [71, 85, 105],
      sidebar: [236, 253, 245],
      header: [209, 250, 229],
    };
  }

  // Este retorno cria o tema clássico elegante, inspirado no print descrito.
  return {
    page: [244, 238, 230],
    accent: [154, 91, 68],
    text: [47, 42, 39],
    muted: [121, 106, 96],
    sidebar: [239, 228, 218],
  };
}

// Esta função devolve o texto real ou uma marcação simples de campo pendente.
function valueOrEmpty(value: string, emptyText: string) {
  // Este retorno evita inventar informação quando o jovem não escreveu o dado.
  return value.trim() || `A preencher: ${emptyText}`;
}

// Esta função limita listas grandes para o currículo caber melhor em uma folha A4.
function limitItems(items: string[], maxItems: number) {
  // Esta condição mantém todos os itens quando a lista já é curta.
  if (items.length <= maxItems) {
    // Este retorno preserva os itens reais.
    return items;
  }

  // Este retorno mostra os primeiros itens e indica que há mais detalhes para entrevista.
  return [...items.slice(0, maxItems), "Outros detalhes podem ser apresentados na entrevista."];
}

// Esta função cria as seções principais do currículo para o PDF.
function buildMainSections(resume: ResumeData): PdfSection[] {
  // Este retorno coloca as informações principais na coluna direita sem seção de resumo.
  return [
    // Esta seção aparece primeiro porque o currículo ficou mais direto e objetivo.
    {
      title: "Experiências",
      items: limitItems(resume.experiences, 5),
      emptyText: "cite trabalhos, ajudas, projetos ou experiências informais.",
    },
    {
      title: "Formação",
      text: resume.education,
      emptyText: "informe sua escola, série, curso técnico ou faculdade.",
    },
    {
      title: "Informações adicionais",
      items: limitItems(resume.additionalInfo, 4),
      emptyText: "cite disponibilidade, CNH ou outros dados úteis.",
    },
  ];
}

// Esta função cria as seções da coluna lateral do currículo.
function buildSideSections(resume: ResumeData): PdfSection[] {
  // Este retorno coloca contato, habilidades e cursos na coluna esquerda.
  return [
    {
      title: "Contato",
      items: [
        valueOrEmpty(resume.phone, "telefone"),
        valueOrEmpty(resume.email, "e-mail"),
        valueOrEmpty(resume.city, "cidade"),
        valueOrEmpty(resume.age, "idade"),
      ],
      emptyText: "informe seus dados pessoais.",
    },
    {
      title: "Habilidades",
      items: limitItems(resume.skills, 8),
      emptyText: "cite ferramentas, tarefas ou habilidades.",
    },
    {
      title: "Cursos",
      items: limitItems(resume.courses, 4),
      emptyText: "cite cursos, certificados ou capacitações.",
    },
  ];
}

// Esta função cria um PDF e baixa o arquivo no computador do usuário.
export async function downloadResumePdf(
  // Este parâmetro traz os dados que serão escritos no currículo.
  resume: ResumeData,

  // Este parâmetro informa qual template visual deve ser desenhado no PDF.
  templateId: ResumeTemplateId,
) {
  // Esta importação dinâmica carrega a biblioteca de PDF apenas no navegador.
  const { jsPDF } = await import("jspdf");

  // Esta linha cria uma página A4 pronta para impressão.
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  // Esta constante guarda a largura da página.
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Esta constante guarda a altura da página.
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Esta constante guarda as cores do template escolhido.
  const theme = getPdfTheme(templateId);

  // Esta constante define a margem externa do currículo.
  const margin = 40;

  // Esta constante define a largura da coluna esquerda menor.
  const sidebarWidth = 170;

  // Esta constante define o espaço entre as duas colunas.
  const columnGap = 26;

  // Esta constante define onde começa a coluna direita maior.
  const mainX = margin + sidebarWidth + columnGap;

  // Esta constante define a largura da coluna direita.
  const mainWidth = pageWidth - mainX - margin;

  // Esta constante define a largura útil da coluna esquerda.
  const sideWidth = sidebarWidth - 24;

  // Esta função aplica uma cor RGB no jsPDF.
  const setColor = (color: [number, number, number]) => {
    // Esta linha passa a cor para o jsPDF.
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  // Esta função escreve texto com quebra automática em uma largura específica.
  const writeWrappedText = (
    // Este parâmetro define a posição horizontal.
    x: number,

    // Este parâmetro define a posição vertical inicial.
    y: number,

    // Este parâmetro define a largura máxima do texto.
    width: number,

    // Este parâmetro recebe o texto que será escrito.
    text: string,

    // Este parâmetro define o tamanho da fonte.
    fontSize: number,

    // Este parâmetro define a altura de cada linha.
    lineHeight: number,

    // Este parâmetro define a cor do texto.
    color: [number, number, number],

    // Este parâmetro define o estilo da fonte.
    fontStyle: "normal" | "bold" | "italic" = "normal",
  ) => {
    // Esta linha escolhe a fonte padrão com o estilo pedido.
    pdf.setFont("helvetica", fontStyle);

    // Esta linha define o tamanho do texto.
    pdf.setFontSize(fontSize);

    // Esta linha aplica a cor do texto.
    setColor(color);

    // Esta linha quebra o texto para caber na coluna.
    const lines = pdf.splitTextToSize(text, width);

    // Esta linha escreve o texto no PDF.
    pdf.text(lines, x, y);

    // Este retorno informa a próxima posição vertical depois do texto.
    return y + lines.length * lineHeight;
  };

  // Esta função escreve o título de uma seção.
  const writeSectionTitle = (
    // Este parâmetro define a posição horizontal.
    x: number,

    // Este parâmetro define a posição vertical.
    y: number,

    // Este parâmetro recebe o título.
    title: string,
  ) => {
    // Esta linha escolhe fonte forte para título.
    pdf.setFont("helvetica", "bold");

    // Esta linha deixa o título compacto.
    pdf.setFontSize(9);

    // Esta linha aplica a cor de destaque do template.
    setColor(theme.accent);

    // Esta linha escreve o título em caixa alta.
    pdf.text(title.toUpperCase(), x, y);

    // Este retorno posiciona o próximo conteúdo abaixo do título.
    return y + 14;
  };

  // Esta função escreve uma lista em uma coluna.
  const writeList = (
    // Este parâmetro define a posição horizontal.
    x: number,

    // Este parâmetro define a posição vertical.
    y: number,

    // Este parâmetro define a largura máxima do texto.
    width: number,

    // Este parâmetro recebe os itens reais.
    items: string[],

    // Este parâmetro recebe o texto quando a lista está vazia.
    emptyText: string,
  ) => {
    // Esta constante decide se mostra itens reais ou orientação de preenchimento.
    const visibleItems = items.length > 0 ? items : [`A preencher: ${emptyText}`];

    // Esta variável controla a posição vertical dentro da lista.
    let nextY = y;

    // Esta linha percorre cada item que será desenhado.
    visibleItems.forEach((item) => {
      // Esta linha usa hífen simples para funcionar bem em qualquer PDF.
      nextY = writeWrappedText(x, nextY, width, `- ${item}`, 9.5, 12, theme.text);

      // Esta linha cria um pequeno respiro entre itens.
      nextY += 2;
    });

    // Este retorno informa onde a próxima seção deve começar.
    return nextY;
  };

  // Esta função escreve uma seção em texto ou lista.
  const writeSection = (
    // Este parâmetro define a posição horizontal.
    x: number,

    // Este parâmetro define a posição vertical.
    y: number,

    // Este parâmetro define a largura da seção.
    width: number,

    // Este parâmetro recebe os dados da seção.
    section: PdfSection,
  ) => {
    // Esta linha escreve o título da seção.
    let nextY = writeSectionTitle(x, y, section.title);

    // Esta condição escreve lista quando a seção tem itens.
    if (section.items) {
      // Esta linha escreve os itens da seção.
      nextY = writeList(x, nextY, width, section.items, section.emptyText);
    } else {
      // Esta linha escolhe texto real ou orientação quando o campo está vazio.
      const text = valueOrEmpty(section.text ?? "", section.emptyText);

      // Esta linha escreve o parágrafo da seção.
      nextY = writeWrappedText(x, nextY, width, text, 9.8, 12.5, theme.text);
    }

    // Este retorno deixa espaço antes da próxima seção.
    return nextY + 13;
  };

  // Esta função desenha o fundo e áreas principais do template.
  const drawTemplateBase = () => {
    // Esta linha pinta o fundo da página.
    pdf.setFillColor(theme.page[0], theme.page[1], theme.page[2]);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Esta condição cria uma base especial para o modelo Clássico Elegante.
    if (templateId === "classic-elegant") {
      // Esta linha desenha uma divisória horizontal fina abaixo do nome.
      pdf.setDrawColor(214, 195, 178);
      pdf.setLineWidth(0.7);
      pdf.line(margin, 132, pageWidth - margin, 132);

      // Esta linha desenha uma divisória vertical para reforçar as duas colunas.
      pdf.line(margin + sidebarWidth + 10, 154, margin + sidebarWidth + 10, pageHeight - 48);

      // Este retorno evita desenhar fundos de coluna usados nos outros templates.
      return;
    }

    // Esta condição desenha cabeçalho colorido em templates que usam esse estilo.
    if (theme.header) {
      // Esta linha pinta o cabeçalho superior.
      pdf.setFillColor(theme.header[0], theme.header[1], theme.header[2]);
      pdf.rect(0, 0, pageWidth, 122, "F");
    }

    // Esta linha pinta a coluna lateral menor.
    pdf.setFillColor(theme.sidebar[0], theme.sidebar[1], theme.sidebar[2]);
    pdf.roundedRect(margin, 154, sidebarWidth, pageHeight - 194, 4, 4, "F");

    // Esta linha desenha uma linha sutil entre cabeçalho e conteúdo.
    pdf.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    pdf.setLineWidth(0.8);
    pdf.line(margin, 132, pageWidth - margin, 132);
  };

  // Esta função escreve o cabeçalho com nome grande e objetivo em itálico.
  const writeHeader = () => {
    // Esta constante mostra o nome real ou uma orientação.
    const displayedName = resume.name || "Nome a preencher";

    // Esta constante mostra o objetivo real ou uma orientação.
    const displayedObjective =
      resume.professionalObjective || "Objetivo profissional a preencher";

    // Esta constante define a cor do nome conforme o template.
    const headerTextColor: [number, number, number] =
      templateId === "modern-professional" ? [255, 255, 255] : theme.accent;

    // Esta constante define a cor do objetivo.
    const objectiveColor: [number, number, number] =
      templateId === "modern-professional" ? [186, 230, 253] : theme.muted;

    // Esta linha escreve o nome grande no topo.
    writeWrappedText(
      margin,
      58,
      pageWidth - margin * 2,
      displayedName,
      templateId === "classic-elegant" ? 29 : 25,
      templateId === "classic-elegant" ? 32 : 28,
      headerTextColor,
      "bold",
    );

    // Esta linha escreve o objetivo abaixo do nome em itálico.
    writeWrappedText(
      margin,
      templateId === "classic-elegant" ? 96 : 91,
      pageWidth - margin * 2,
      displayedObjective,
      12,
      14,
      objectiveColor,
      "italic",
    );
  };

  // Esta linha desenha a base visual do template.
  drawTemplateBase();

  // Esta linha escreve o cabeçalho do currículo.
  writeHeader();

  // Esta variável controla a posição vertical na coluna lateral.
  let sideY = templateId === "classic-elegant" ? 168 : 184;

  // Esta variável controla a posição vertical na coluna principal.
  let mainY = templateId === "classic-elegant" ? 168 : 168;

  // Esta linha escreve as seções da coluna esquerda.
  buildSideSections(resume).forEach((section) => {
    // Esta linha escreve contato, habilidades e cursos na lateral.
    sideY = writeSection(margin + 12, sideY, sideWidth, section);
  });

  // Esta linha escreve as seções da coluna direita.
  buildMainSections(resume).forEach((section) => {
    // Esta linha escreve experiências, formação e adicionais sem seção de resumo.
    mainY = writeSection(mainX, mainY, mainWidth, section);
  });

  // Esta linha salva o arquivo no navegador com um nome pronto para impressão.
  pdf.save("curriculo-crj.pdf");
}
