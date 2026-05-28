// Este arquivo guarda a logica que transforma o curriculo em um arquivo Word editavel.
import type { ResumeData, ResumeTemplateId } from "@/types/resume";

// Este tipo organiza as cores principais usadas no DOCX.
type DocxTheme = {
  // Este campo guarda a cor de destaque dos titulos.
  accent: string;

  // Este campo guarda a cor principal do texto.
  text: string;

  // Este campo guarda a cor secundaria do texto.
  muted: string;
};

// Este tipo organiza cada secao textual do curriculo em Word.
type DocxSection = {
  // Este campo guarda o titulo exibido acima da secao.
  title: string;

  // Este campo guarda um texto unico quando a secao nao usa lista.
  text?: string;

  // Este campo guarda itens em lista quando a secao tem varios pontos.
  items?: string[];

  // Este campo orienta a equipe quando o dado ainda precisa ser preenchido.
  emptyText: string;
};

// Esta funcao escolhe cores discretas para o Word com base no modelo selecionado.
function getDocxTheme(templateId: ResumeTemplateId): DocxTheme {
  // Esta condicao aplica o tom azul do modelo moderno.
  if (templateId === "modern-professional") {
    // Este retorno usa azul profissional e texto escuro.
    return {
      accent: "0369A1",
      text: "0F172A",
      muted: "475569",
    };
  }

  // Esta condicao aplica o tom verde do modelo jovem aprendiz.
  if (templateId === "young-apprentice") {
    // Este retorno usa verde acessivel e texto escuro.
    return {
      accent: "047857",
      text: "0F172A",
      muted: "475569",
    };
  }

  // Este retorno usa terracota do modelo classico elegante.
  return {
    accent: "9A5B44",
    text: "2F2A27",
    muted: "796A60",
  };
}

// Esta funcao devolve o texto real ou uma orientacao de preenchimento.
function valueOrEmpty(value: string, emptyText: string) {
  // Esta constante remove espacos extras antes de decidir o texto final.
  const trimmedValue = value.trim();

  // Este retorno evita inventar informacao quando o curriculo ainda nao tem o dado.
  return trimmedValue || `A preencher: ${emptyText}`;
}

// Esta funcao limita listas grandes para manter o Word objetivo e facil de editar.
function limitItems(items: string[], maxItems: number) {
  // Esta condicao preserva listas que ja estao em tamanho adequado.
  if (items.length <= maxItems) {
    // Este retorno mantem todos os itens recebidos.
    return items;
  }

  // Este retorno mostra os primeiros itens e deixa o restante para ajustes da equipe.
  return [...items.slice(0, maxItems), "Outros detalhes podem ser apresentados na entrevista."];
}

// Esta funcao remove quebras exageradas para o Word ficar limpo.
function normalizeDocxText(text: string) {
  // Este retorno troca sequencias de espaco por um espaco simples.
  return text.replace(/\s+/g, " ").trim();
}

// Esta funcao cria as secoes principais do curriculo em Word.
function buildDocxSections(resume: ResumeData): DocxSection[] {
  // Este retorno mantem uma ordem simples e profissional para edicao posterior.
  return [
    {
      title: "Experiências",
      items: limitItems(resume.experiences, 6),
      emptyText: "cite trabalhos, ajudas, projetos ou experiências informais.",
    },
    {
      title: "Formação",
      text: resume.education,
      emptyText: "informe sua escola, série, curso técnico ou faculdade.",
    },
    {
      title: "Habilidades",
      items: limitItems(resume.skills, 8),
      emptyText: "cite ferramentas, tarefas ou habilidades.",
    },
    {
      title: "Cursos",
      items: limitItems(resume.courses, 5),
      emptyText: "cite cursos, certificados ou capacitações.",
    },
    {
      title: "Informações adicionais",
      items: limitItems(resume.additionalInfo, 5),
      emptyText: "cite disponibilidade, CNH ou outros dados úteis.",
    },
  ];
}

// Esta funcao cria o nome do arquivo sem depender de dados pessoais.
function getDocxFileName() {
  // Este retorno usa um nome generico para nao expor nome do jovem no arquivo gerado automaticamente.
  return "curriculo-crj.docx";
}

// Esta funcao cria um DOCX editavel e baixa o arquivo no computador do usuario.
export async function downloadResumeDocx(
  // Este parametro traz os dados que serao escritos no Word.
  resume: ResumeData,

  // Este parametro informa qual modelo visual deve orientar as cores discretas do Word.
  templateId: ResumeTemplateId,
) {
  // Esta importacao dinamica carrega a biblioteca de Word apenas quando o usuario pede o download.
  const {
    AlignmentType,
    BorderStyle,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
  } = await import("docx");

  // Esta importacao dinamica carrega o salvamento de arquivo apenas no navegador.
  const { saveAs } = await import("file-saver");

  // Esta constante guarda as cores profissionais do documento.
  const theme = getDocxTheme(templateId);

  // Esta constante mostra o nome real ou orienta a equipe a preencher depois.
  const displayedName = valueOrEmpty(resume.name, "nome completo");

  // Esta constante mostra o objetivo real ou orienta a equipe a preencher depois.
  const displayedObjective = valueOrEmpty(
    resume.professionalObjective,
    "objetivo profissional",
  );

  // Esta constante junta dados de contato sem enviar nada para servidor.
  const contactLine = [
    valueOrEmpty(resume.phone, "telefone"),
    valueOrEmpty(resume.email, "e-mail"),
    valueOrEmpty(resume.city, "cidade"),
    valueOrEmpty(resume.age, "idade"),
  ].join(" | ");

  // Esta funcao cria um paragrafo de texto comum no DOCX.
  const createParagraph = (
    // Este parametro recebe o texto que sera escrito.
    text: string,

    // Este parametro permite mudar tamanho e estilo sem repetir configuracao.
    options: { bold?: boolean; italic?: boolean; color?: string; size?: number } = {},
  ) =>
    // Este retorno monta o paragrafo editavel com um TextRun simples.
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: normalizeDocxText(text),
          bold: options.bold,
          italics: options.italic,
          color: options.color ?? theme.text,
          size: options.size ?? 22,
        }),
      ],
    });

  // Esta funcao cria o titulo de cada secao do curriculo.
  const createSectionTitle = (title: string) =>
    // Este retorno usa heading real do Word para facilitar edicao e navegacao no documento.
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 90 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          color: theme.accent,
          size: 22,
        }),
      ],
    });

  // Esta funcao cria um item de lista editavel no Word.
  const createBullet = (text: string) =>
    // Este retorno usa bullet nativo do DOCX, nao imagem, para a equipe poder editar.
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 90 },
      children: [
        new TextRun({
          text: normalizeDocxText(text),
          color: theme.text,
          size: 21,
        }),
      ],
    });

  // Esta funcao transforma uma secao em paragrafos do Word.
  const createSectionParagraphs = (section: DocxSection) => {
    // Esta constante comeca a secao pelo titulo acessivel do Word.
    const sectionParagraphs = [createSectionTitle(section.title)];

    // Esta condicao escreve lista quando a secao tem varios itens.
    if (section.items) {
      // Esta constante decide entre itens reais e uma orientacao de preenchimento.
      const visibleItems =
        section.items.length > 0 ? section.items : [`A preencher: ${section.emptyText}`];

      // Esta linha adiciona cada item como bullet editavel.
      visibleItems.forEach((item) => {
        // Esta linha inclui o item no conjunto de paragrafos da secao.
        sectionParagraphs.push(createBullet(item));
      });

      // Este retorno entrega titulo e bullets.
      return sectionParagraphs;
    }

    // Esta linha adiciona texto corrido quando a secao nao e lista.
    sectionParagraphs.push(createParagraph(valueOrEmpty(section.text ?? "", section.emptyText)));

    // Este retorno entrega titulo e texto da secao.
    return sectionParagraphs;
  };

  // Esta constante monta o documento com paragrafos nativos e editaveis.
  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: normalizeDocxText(displayedName),
                bold: true,
                color: theme.text,
                size: 34,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: normalizeDocxText(displayedObjective),
                italics: true,
                color: theme.muted,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: {
              bottom: {
                color: theme.accent,
                size: 8,
                space: 1,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: normalizeDocxText(contactLine),
                color: theme.muted,
                size: 20,
              }),
            ],
          }),
          ...buildDocxSections(resume).flatMap(createSectionParagraphs),
        ],
      },
    ],
  });

  // Esta linha transforma o documento editavel em Blob para download no navegador.
  const blob = await Packer.toBlob(document);

  // Esta linha baixa o DOCX sem enviar o arquivo ou feedback para servidor.
  saveAs(blob, getDocxFileName());
}
